import StarIcon from "../StarIcon/StarIcon";

import "./filtersPanel.css";


const FiltersPanel = ({ onFilterChange, activeFilter }) => {

    const starStyles = {
        top: "50%",
        transform: "translateY(-50%)",

        fill: "var(--shadow-color)"
    }


    return (
        <div className="filters-panel">
            <button
                className={`filters-btn ${activeFilter === 'favorites' ? 'active' : ''}`}
                data-filter="favorites"
                onClick={(e) => onFilterChange(e)}>

                <StarIcon
                    isDisabled={true}
                    customSvgStyles={starStyles} />Favorites</button>

            <button
                className={`filters-btn ${activeFilter === 'all' ? 'active' : ''}`}
                data-filter="all"
                onClick={(e) => onFilterChange(e)}>All coins</button>
        </div>
    )
}

export default FiltersPanel;