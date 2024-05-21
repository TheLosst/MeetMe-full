<?php
$dns = 'mysql:host=localhost;dbname=db2';
$user = 'root';
$pass = '1317';

try{
  $db = new PDO ($dns, $user, $pass);
  
}catch( PDOException $e){
    $error = $e->getMessage();
    echo $error;
}
$username = $_POST['username'];
$stm = $db->prepare("SELECT email FROM users where username = '$username'");
$stm->execute();
$rows = $stm->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);
?>