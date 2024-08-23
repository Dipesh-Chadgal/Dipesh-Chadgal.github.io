<?php
$con = mysqli_connect('localhost', 'root', '','db_connect');

$Name = $_POST['Name'];
$Email = $_POST['Email'];


$sql = "INSERT INTO `info` (`Name`, `Email` ) VALUES ('$Name', '$Email' )";
$rs = mysqli_query($con, $sql);
if($rs)
{
	echo "Contact Records Inserted";
}
?>