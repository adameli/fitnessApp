<?php

function send($data = [], $status = 200) {
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function abort($message = "", $status = 400) {
    send(["error" => $message], $status);
}



?>