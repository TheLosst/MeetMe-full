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
$stm = $db->prepare("SELECT toUsr AS toUsr FROM messages where fromUsr = '$fromID' GROUP BY toUsr UNION SELECT fromUsr AS toUsr FROM messages where toUsr = '$fromID' GROUP BY toUsr");
$stm->execute();
$rows = $stm->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);
?>