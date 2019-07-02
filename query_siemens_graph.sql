SELECT 
	time,
	channel_number,
	concentration
FROM 
	siemens_analiser
where 
	year(time)=? and channel_number=? and datediff(date(now()),date(time))<=7;