<?php

function reset_db () {
  // define('DB_STRUCTURE_FILE', DB_ADMIN_SCRIPTS_PATH . "db_reset_files/db_structure.sql");
  $db_file = '../database.db';
  _echo("Resetting DB...");

  // REMOVE DB FILE
  if (file_exists($db_file)) {
    _echo("Removing old sqlite file...");
    unlink($db_file);
  } else {
    _echo("No old sqlite file...");
  }

  // CREATE DB
  _echo("Creating new sqlite file..");
  $_pdo = get_pdo();
  $_pdo->exec(file_get_contents('db_structure.sql'));
  _echo("Done.");

}


?>