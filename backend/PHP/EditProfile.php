<?php
        header("Content-type:application/json;charset=utf-8");
        $mysqli = new mysqli('localhost','root','1317','MeetMe');
        $userID = $_POST['id'];
        $username = $_POST['username'];
	$birthDate = $_POST['birthDate'];
	$withMeets = $_POST['withMeets'];
        $targetMeet = $_POST['targetMeet'];
	$about = $_POST['about'];
	$linkTiIMG =$_POST['link'];
	if ($mysqli->connect_error) {
    		die("Connection failed: " . $conn->connect_error);
	}
	$stmt = $mysqli->prepare("SELECT * FROM users WHERE id = '$userID'");
	$stmt->execute();
        $stmt->store_result();
	$sql_editProfile = "UPDATE users SET username = '$username',birthDay = '$birthDate',withMeets = '$withMeets',targetMeet = '$targetMeet',aboutUser = '$about',linkToImg = '$linkTiIMG' WHERE id = '$userID'";
	 if ($stmt->num_rows == 1) { 
	 	if ($mysqli->query($sql_editProfile) === TRUE) {
  			echo json_encode("Edit Succ");
		} else {
  			echo json_encode("Edit Error");
		}	
	}
	else
	{
		echo json_encode("Account not found");
	}
	$mysqli->close();
?>
