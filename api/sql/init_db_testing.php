<?php

function init_db_testing ()
{
  // define('DB_INIT_FILE', DB_ADMIN_SCRIPTS_PATH . "db_reset_files/db_initial_values_testing.sql");

  _echo("Initing DB with testing values...");
  $_pdo = get_pdo();
  $_pdo->exec(file_get_contents('db_initial_values_testing.sql'));
  _echo("Done.");

}

function _echo ($string) {
  echo $string;
  echo '<br>';
}


?>

