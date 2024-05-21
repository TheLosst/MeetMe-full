<?php
        header("Content-type:application/json;charset=utf-8");

$servername = "localhost";
$usernamedb = "root";
$passworddb = "1317";
$dbname = "MeetMe";

        $mysqli = new mysqli($servername,$usernamedb,$passworddb,$dbname);

	$fromUsr = $_POST['fromUsr'];
	
        $toUsr = $_POST['toUsr'];
        $Text = $_POST['text'];


	if ($mysqli->connect_error) {
    		die("Connection failed: " . $conn->connect_error);
	} 

        $stmt = $mysqli->prepare("SELECT * FROM messages WHERE fromUsr = ?");
        $stmt->bind_param("s",$fromUsr);
        $stmt->execute();
        $stmt->store_result();

                //$insert = "INSERT INTO users(username,password,email,withMeets,targetMeet,targetHeight,targetFat,birthDay)VALUES('".$username."','".$password."','".$email."','".$withMeets."','".$targetMeet."','".$targetHeight."','".$targetFat."','".$birthDay."')";
                $stmtreg = $mysqli->prepare("INSERT INTO messages (fromUsr,toUsr,text) VALUES(?,?,?)");

                $stmtreg->bind_param("sss",$fromUsr,$toUsr,$Text);

                $stmtreg->execute();

                $stmtreg->store_result();
		
                echo json_encode("Success");
$mysqli->close();
?>
