SELECT
  time,
	MV_HEAT,
	PROGRAM_NUMBER,
	TEMP_S,
	TEMP_K,
	set_value,
	fan_speed
FROM
  fr06
WHERE
  year(date(time))=? and PROGRAM_NUMBER=?
GROUP BY
  time;