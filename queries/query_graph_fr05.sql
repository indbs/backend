SELECT
  time,
	temperature,
	PROGRAM_NUMBER,
	sp,
	output_power
FROM
  fr05
WHERE
  year(date(time))=? and PROGRAM_NUMBER=?
GROUP BY
  time;