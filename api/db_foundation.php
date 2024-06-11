<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

function get_pdo ()  {

  $db_path = __DIR__ . '/database.db';
  // $db_path = 'database.db';
  // realpath($db_path)
  $_pdo = new \PDO("sqlite:" . $db_path , '', '', array(
    \PDO::ATTR_EMULATE_PREPARES => false,
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
  ));
  $_pdo->exec('PRAGMA foreign_keys = ON');
  
  return $_pdo;
}

function array_from_query($sql) {
  $array = [];
  $pdo = get_pdo();
  $stmt = $pdo -> query($sql);
  while ($element = $stmt->fetch(\PDO::FETCH_ASSOC)) {
    if (is_array($element)) {
      foreach($element as &$value) {
        if (is_numeric($value)) { $value = intval($value); }
      }
    }
    $array[] = $element;
  }
  return $array;
}

function id_from_entity ($entity) {
  return substr($entity, 0, -1) . "_id";
}
?>


