<?php
require_once __DIR__ . '/../config/database.php';

class Validator {
    public static function validate($data, $rules) {
        $errors = [];
        
        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? null; // safe access
    
            if (is_array($rule)) {
                if (isset($rule['type'])) {
                    if ($rule['type'] === 'required' && empty($value)) {
                        $errors[] = "$field is required";
                    } elseif ($rule['type'] === 'email' && (!isset($value) || !filter_var($value, FILTER_VALIDATE_EMAIL))) {
                        $errors[] = "$field must be a valid email";
                    } elseif ($rule['type'] === 'enum' && (!isset($value) || !in_array($value, $rule['values']))) {
                        $errors[] = "$field must be one of: " . implode(', ', $rule['values']);
                    } elseif ($rule['type'] === 'numeric' && (!isset($value) || !is_numeric($value))) {
                        $errors[] = "$field must be numeric";
                    } elseif ($rule['type'] === 'date' && (!isset($value) || !DateTime::createFromFormat('Y-m-d', $value))) {
                        $errors[] = "$field must be a valid date (Y-m-d)";
                    } elseif ($rule['type'] === 'boolean' && (!isset($value) || (!is_bool($value) && !in_array($value, [0, 1, '0', '1'])))) {
                        $errors[] = "$field must be boolean";
                    } elseif ($rule['type'] === 'json' && (!isset($value) || !is_array($value))) {
                        $errors[] = "$field must be a valid JSON array";
                    } elseif ($rule['type'] === 'time' && (!isset($value) || !DateTime::createFromFormat('H:i:s', $value))) {
                        $errors[] = "$field must be a valid time (H:i:s)";
                    } elseif ($rule['type'] === 'day_of_week' && (!isset($value) || !in_array(strtolower($value), ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']))) {
                        $errors[] = "$field must be a valid day of the week";
                    }
                }
            } else {
                if ($rule === 'required' && empty($value)) {
                    $errors[] = "$field is required";
                } elseif ($rule === 'email' && (!isset($value) || !filter_var($value, FILTER_VALIDATE_EMAIL))) {
                    $errors[] = "$field must be a valid email";
                } elseif ($rule === 'enum' && (!isset($value) || !in_array($value, ['student','teacher','admin']))) {
                    $errors[] = "$field must be one of: student, teacher, admin";
                }
            }
        }
        return $errors;
    }


    public static function exists($table, $field, $value) {
        $db = getDB();
        $stmt = $db->prepare("SELECT COUNT(*) FROM {$table} WHERE {$field} = ?");
        $stmt->execute([$value]);
        return $stmt->fetchColumn() > 0;
    }
}
?>