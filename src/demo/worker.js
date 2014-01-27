var i = 0;
function timedCount(){
	i=i+1;
	this.postMessage(i);
	setTimeout("timedCount()",1000);
}
timedCount();



