SELECT 
	PROGRAM_NUMBER,
	substring(PROGRAMS_HEAT.PROGRAM_NAME,1,locate(char(0),PROGRAMS_HEAT.PROGRAM_NAME)-1) as PROGRAM_NAME,
	STEP_NO,
	T_M_MODE,
	T_M_TEMP,
	T_M_TIME_WIDTH,
	INSERTED
FROM 
	PROGRAMS_HEAT 
WHERE
	year(date(inserted))=? and PROGRAM_NUMBER=?;