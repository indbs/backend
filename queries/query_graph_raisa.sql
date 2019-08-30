SELECT
  time,
	average,
	setpoint,
	current_l1,
	current_l2,
	current_l3,
	PROGRAM_NUMBER,
	tc410,
	tc411,
	tc412,
	analiser_calc,
	oxygen_predict_sp_float as oxygen_predict_sp,
	flap_a_percent_position,
	flap_b_percent_position,
	flap_c_percent_position,
	flap_d_percent_position,
	flap_e_percent_position
FROM
  KILN_WORK_FINAL_LAST3
WHERE
  year(date(time))=? and PROGRAM_NUMBER=?
GROUP BY
  time;