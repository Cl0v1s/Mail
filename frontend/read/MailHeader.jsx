import React from 'react';

export default ({mail, onClick}) => {
	const unix = Date.parse(mail.Date);
	let date = new Date(unix);
	date = date.toLocaleDateString('fr-FR', { 
		year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: "2-digit"
	});
	const froms = mail.From.map((from) => 
		<span class="from rounded p-1 text-white bg-purple-500" title={ from.address }>
			{ from.name ? from.name : from.address }
		</span>
	);
	return (
		<div className="component-mail border border-gray-200 rounded p-3" onClick={() => onClick(mail)}>
			<div className="meta flex-none sm:flex justify-between mb-2">
				<div className="froms">
					{ froms }
				</div>
				<div className="date text-gray-500 block mt-1 sm:mt-0">
					{ date }
				</div>
			</div>
			<span className="subject text-gray-800">
				{ mail.Subject }
			</span>
		</div>
	)
};