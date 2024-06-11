<?php


// require_once(ROOT_PATH . "data/api/api_foundation.php");
require_once('reset_db.php');
require_once('init_db_testing.php');
require_once('../db_foundation.php');

// $ignore_files = [
//   ".DS_Store",
// ];

// $path = DB_ADMIN_SCRIPTS_PATH;
// $files = array_diff(scandir($path), array('.', '..'));

// foreach ($files as $file)
// {
//   if (in_array($file, $ignore_files)) continue;
//   if (is_dir($path.$file)) continue; 
//   require "$path/$file";
//   echo "Required $file<br>";
// }

// ACTIONS HERE

// RESET
reset_db();

// INIT DB_TESTING
init_db_testing();

// $user_name = "erik";
// $password = "x";
// $sql = "SELECT * FROM games";
// _echo($sql);
// $results = array_from_query($sql);
// print_r($results);
// if (count($results) > 0) _echo("Login");
// else _echo("Not login");

// get_pdo()->exec("INSERT INTO users (name) VALUES('filip');");
// get_pdo()->exec("INSERT INTO games (name, user_id, rating, favorite) VALUES('GTA 5', 1, 4, false);");
// get_pdo()->exec("DELETE FROM users WHERE user_id = 6;");


?>
