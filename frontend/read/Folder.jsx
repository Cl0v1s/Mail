import React from 'react';

export default ({folder, onClick}) => {
	return (
		<div 
			className="component-folder border border-gray-200 p-3 cursor-pointer flex-grow"
			onClick={() => onClick(folder)}
		>
			<div className={`name text-gray-800 truncate ${folder.parent != null ? 'pl-2 border-l-4' : ''}`}>
				{ folder.name }
			</div>
			{
				/*
				<div className="status rounded bg-gray-300 text-gray-800 p-1">
					{ folder.unread }/{ folder.length ? folder.length : "?"}
				</div>
				*/
			}

		</div>
	);
}