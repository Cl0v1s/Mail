import React from 'react';

export default ({selected, loading, folder, onClick}) => {
	return (
		<div 
			className={`
				component-folder
				border border-gray-200 p-3 cursor-pointer 
				flex-grow 
				flex items-center
				${selected ? 'bg-gray-200' : ''}
				`}
			onClick={() => onClick(folder)}
		>
			<div className={`name text-gray-800 flex-grow truncate ${folder.parent != null ? 'pl-2 border-l-4' : ''}`}>
				{
					selected
					&& <i className="fa fa-caret-right mr-1"></i>
				}
				{ folder.name }
			</div>
			<div>
				{
					loading
					&& <i className="fas fa-spin fa-circle-notch"></i>
				}
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