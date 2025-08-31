<?php
require_once __DIR__ . '/../config/database.php';

class Location {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM locations");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM locations WHERE location_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $locationId = uniqid('loc_');
        $stmt = $this->db->prepare(
            "INSERT INTO locations (location_id, name, latitude, longitude, location_type, capacity) 
            VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $locationId,
            $data['name'],
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            $data['location_type'] ?? null,
            $data['capacity'] ?? null
        ]);
        return $locationId;
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare(
            "UPDATE locations SET name = ?, latitude = ?, longitude = ?, location_type = ?, capacity = ? 
            WHERE location_id = ?"
        );
        $stmt->execute([
            $data['name'],
            $data['latitude'] ?? null,
            $data['longitude'] ?? null,
            $data['location_type'] ?? null,
            $data['capacity'] ?? null,
            $id
        ]);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM locations WHERE location_id = ?");
        $stmt->execute([$id]);
        return true;
    }
}
?>