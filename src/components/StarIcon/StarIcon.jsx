import { useState, useEffect } from "react";

import "./starIcon.css";

const StarIcon = ({ dataId, isDisabled = false, customSvgStyles = {}, onFavoriteChange }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const classNames = `star-icon ${isFavorite || isDisabled ? 'filled' : null}`;

    useEffect(() => {
        let favorites = localStorage.getItem('favorites');  
        
        favorites = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favorites.includes(dataId));
    }, [dataId]);

    const onClick = (e) => {
        if (!isDisabled) {
            const dataIndex = e.currentTarget.getAttribute('data-index');

            e.stopPropagation();

            // Додаємо в обране або видаляємо з обраного
            let favorites = localStorage.getItem('favorites');
            favorites = favorites ? JSON.parse(favorites) : [];
            const index = favorites.indexOf(dataIndex);
            let isRemoved = false;
            if (index !== -1) {
                favorites.splice(index, 1);
                setIsFavorite(false);
                isRemoved = true;
            } else {
                favorites.push(dataIndex);
                setIsFavorite(true);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));

            switchFocusOnParent(e);

            // Викликаємо функцію зворотного виклику
            onFavoriteChange(isRemoved);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onClick(e);
            switchFocusOnParent(e);
        }
    };

    const switchFocusOnParent = (e) => {
        // Переміщення фокусу на батьківский елемент
        const previousElement = e.currentTarget.parentNode;
        if (previousElement) {
            previousElement.focus();
        }
    }

    return (
        <svg
            className={classNames}
            tabIndex={!isDisabled ? 0 : null}
            onClick={onClick}
            onKeyDown={onKeyDown}
            data-index={dataId}
            style={customSvgStyles}

            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-4.79 -4.79 57.52 57.52"
            strokeWidth="4.794">

            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.09587999999999999" />
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z" />

            </g>
        </svg>
    )
};

export default StarIcon;