import unittest
from mining import Asteroid, Ship

class MiningTests(unittest.TestCase):
    def test_mining_consumes_energy(self):
        ship = Ship()
        remaining, mined = ship.mine(Asteroid("iron", 20, 2), 5)
        self.assertEqual((remaining.available, mined, ship.energy), (15, 5, 90))

    def test_cargo_capacity(self):
        ship = Ship(cargo_capacity=3)
        _, mined = ship.mine(Asteroid("ice", 10), 8)
        self.assertEqual(mined, 3)

    def test_energy_limit(self):
        ship = Ship(energy=3)
        _, mined = ship.mine(Asteroid("gold", 10, 2), 10)
        self.assertEqual(mined, 1)

    def test_unload(self):
        ship = Ship(cargo={"iron": 5})
        ship.unload("iron", 5)
        self.assertEqual(ship.cargo_used, 0)

    def test_invalid_request(self):
        with self.assertRaises(ValueError):
            Ship().mine(Asteroid("iron", 2), -1)

if __name__ == "__main__":
    unittest.main()
