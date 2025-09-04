import React from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative group inline-block">
            {children}
            <div className={`absolute ${positionClasses[position]} invisible group-hover:visible bg-gray-900 text-white text-sm rounded py-1 px-2 whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                {text}
                <div className="absolute w-2 h-2 bg-gray-900 rotate-45 transform -translate-x-1/2 left-1/2 top-full"></div>
            </div>
        </div>
    );
};

export default Tooltip;
