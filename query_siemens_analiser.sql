SELECT 
	max(time) as time,
	channel_number,
	concentration
from
	siemens_analiser
where
	year(time)=? and channel_number=?;