<?php
$dns = 'mysql:host=localhost;dbname=MeetMe';
$user = 'root';
$pass = '1317';

try{
  $db = new PDO ($dns, $user, $pass);
  
}catch( PDOException $e){
    $error = $e->getMessage();
    echo $error;
}
$fromID = $_POST['id'];
$toID = $_POST['toid'];
$stm = $db->prepare("SELECT * FROM messages where (fromUsr = '$fromID' AND toUsr = '$toID') OR (fromUsr = '$toID' AND toUsr = '$fromID')");
$stm->execute();
$rows = $stm->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);
?>