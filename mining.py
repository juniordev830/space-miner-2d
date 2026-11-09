"""Deterministic resource mining and cargo inventory prototype."""
from dataclasses import dataclass, field

@dataclass(frozen=True)
class Asteroid:
    resource: str
    available: int
    hardness: int = 1

    def __post_init__(self):
        if not self.resource or self.available < 0 or self.hardness <= 0:
            raise ValueError("Invalid asteroid")

@dataclass
class Ship:
    cargo_capacity: int = 50
    energy: int = 100
    cargo: dict[str, int] = field(default_factory=dict)

    def __post_init__(self):
        if self.cargo_capacity <= 0 or not 0 <= self.energy <= 100:
            raise ValueError("Invalid ship")

    @property
    def cargo_used(self) -> int:
        return sum(self.cargo.values())

    def mine(self, asteroid: Asteroid, requested: int) -> tuple[Asteroid, int]:
        if requested <= 0:
            raise ValueError("Requested amount must be positive")
        amount = min(requested, asteroid.available,
                     self.cargo_capacity - self.cargo_used,
                     self.energy // asteroid.hardness)
        if amount <= 0:
            return asteroid, 0
        self.energy -= amount * asteroid.hardness
        self.cargo[asteroid.resource] = self.cargo.get(asteroid.resource, 0) + amount
        return Asteroid(asteroid.resource, asteroid.available - amount, asteroid.hardness), amount

    def unload(self, resource: str, amount: int) -> None:
        if amount <= 0 or amount > self.cargo.get(resource, 0):
            raise ValueError("Invalid unload amount")
        self.cargo[resource] -= amount
        if self.cargo[resource] == 0:
            del self.cargo[resource]
