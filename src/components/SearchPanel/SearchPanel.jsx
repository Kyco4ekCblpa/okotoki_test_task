import { useState, useEffect, useRef } from "react";

import Fuse from 'fuse.js'

import { useHttp } from "../../hooks/http.hook";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import VirtualScroll from "../VirtualScroll/VirtualScroll";
import Spinner from "../Spinner/Spinner";

import searchIcon from "../../assets/icons/search.svg";
import "./searchPanel.css";

const SearchPanel = ({ buttonRef, showSearchPanel, setShowSearchPanel }) => {
    const { request } = useHttp();

    const [coins, setCoins] = useState([]);
    const [coinsLoaded, setCoinsLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [error, setError] = useState(null);

    const panelRef = useRef(null);
    const inputRef = useRef(null);
    const buttonRect = buttonRef.current.getBoundingClientRect();

    const fuse = new Fuse(coins, { shouldSort: true });
    const scrollDiv = useRef(null);

    let style;

    useEffect(() => {
        getAllCoins();
    }, []);

    useEffect(() => {
        if (showSearchPanel && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearchPanel]);

    useEffect(() => {
        if (scrollDiv.current) {
            scrollDiv.current.scrollTop = 0;
        }
    }, [filteredCoins]);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const coinsToDisplay = activeFilter === 'favorites'
            ? coins.filter(coin => favorites.includes(coin))
            : coins;

        setFilteredCoins(coinsToDisplay);
    }, [activeFilter, coins, searchValue]);


    // Хук забезпечує пошук, коли введено значення у рядок пошуку і відбувається зміна активного фільтру
    // (випадок, коли активний фільтр "favorites" та відбувається повторний клік на нього обробляється окремо)
    
    useEffect(() => {
        if (searchValue) {
            const searchResults = fuse.search(searchValue).map(item => item.item);
            let coinsToDisplay;

            if (activeFilter === 'favorites') {
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                coinsToDisplay = searchResults.filter(coin => favorites.includes(coin));
            } else {
                coinsToDisplay = searchResults;
            }

            setFilteredCoins(coinsToDisplay);
        }
    }, [activeFilter, searchValue]);


    useEffect(() => {
        const onClickOutsidePanel = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setShowSearchPanel(false);
            }
        }

        document.addEventListener("click", onClickOutsidePanel);

        return () => {
            document.removeEventListener("click", onClickOutsidePanel);
        };
    }, [panelRef]);

    const getAllCoins = () => {
        request("https://api-eu.okotoki.com/coins")
            .then(onCoinsLoaded)
            .catch(() => {
                setError(true);
            });
    }

    const onCoinsLoaded = (coins) => {
        setCoins(coins.filter(
            item => item !== ""
        ));

        setCoinsLoaded(true);
    }

    const onSearchInputChange = (e) => {
        setSearchValue(e.target.value);

        const searchResults = fuse.search(e.target.value).map(
            item => item.item
        )

        if (searchResults.length > 0) {
            // Якщо активний фільтр "favorites", фільтруємо результати пошуку
            const filteredSearchResults = activeFilter === 'favorites'
                ? searchResults.filter(coin => JSON.parse(localStorage.getItem('favorites')).includes(coin))
                : searchResults;

            setFilteredCoins(filteredSearchResults);
        } else {
            // Якщо активний фільтр "all", встановлюємо filteredCoins рівному coins
            if (activeFilter === 'all') {
                setFilteredCoins(coins);
            } else {
                // Інакше встановлюємо filteredCoins рівним обраним валютам
                setFilteredCoins(coins.filter(coin => JSON.parse(localStorage.getItem('favorites')).includes(coin)));
            }
        }
    }

    const clearSearch = (e) => {
        // Вимкнув "спливання", щоб клік по кнопці очистки не закривав панель
        e.stopPropagation();
        setSearchValue('');

        if (showSearchPanel && inputRef.current) {
            inputRef.current.focus();
        }
    }

    const onFilterChange = (e) => {
        const newFilter = e.target.dataset.filter;

        if (newFilter) {
            setActiveFilter(newFilter);
        }

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // Якщо є клік на "favorites", коли він вже активний, скидаємо значення пошуку
        if (newFilter === 'favorites' && activeFilter === 'favorites') {
            setSearchValue("");
            setFilteredCoins(coins.filter(coin => favorites.includes(coin)));
        } else {
            // Якщо є значення пошуку, відфільтровуємо монети, які відповідають пошуку
            const searchResults = searchValue ? fuse.search(searchValue).map(item => item.item) : coins;
            const coinsToDisplay = newFilter === 'favorites'
                ? searchResults.filter(coin => favorites.includes(coin))
                : searchResults;

            setFilteredCoins(coinsToDisplay);
        }
    }

    const onFavoriteChange = () => {
        // Оновлюємо список обраних валют
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let coinsToDisplay;

        if (searchValue) {
            // Якщо є значення пошуку, відфільтровуємо монети, які відповідають пошуку
            const searchResults = fuse.search(searchValue).map(item => item.item);
            coinsToDisplay = activeFilter === 'favorites'
                ? searchResults.filter(coin => favorites.includes(coin))
                : searchResults;
        } else {
            // Якщо значення пошуку немає, просто відфільтровуємо монети за активним фільтром
            coinsToDisplay = activeFilter === 'favorites'
                ? coins.filter(coin => favorites.includes(coin))
                : coins;
        }

        setFilteredCoins(coinsToDisplay);
    }

    // Костиль у вигляді очікуваних розмірів панелі (відповідно до її параметрів у css) + номінальний відступ у 5px
    const expectedPanelHeight = 425;
    const expectedPanelWidth = 305;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Позиціонування панелі пошуку залежно від розташування кнопки
    if (windowHeight - buttonRect.bottom < expectedPanelHeight) {
        style = {
            position: 'absolute',
            bottom: `${windowHeight - buttonRect.top}px`,
            left: `${buttonRect.left}px`
        };
    } else {
        style = {
            position: 'absolute',
            top: `${buttonRect.bottom + 5}px`,
            left: `${buttonRect.left}px`
        };
    }

    // Якщо кнопка притиснута до правого краю, змінюємо положення панелі
    if (windowWidth - buttonRect.right < expectedPanelWidth) {
        style = {
            ...style,
            right: `${windowWidth - buttonRect.right}px`, // Враховуємо номінальний відступ у 5px
        };
        delete style.left; // Видаляємо властивість left, щоб вона не конфліктувала з right
    }

    return (
        <div className="search-panel" style={style} ref={panelRef}>
            <div className="search-line">
                <img src={searchIcon} alt="search-icon" className='search-panel-icon' />

                <input
                    onChange={onSearchInputChange}
                    value={searchValue}
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search..." />

                {searchValue && <button className="search-reset-btn" onClick={clearSearch} tabIndex={0}></button>}
            </div>

            <FiltersPanel onFilterChange={onFilterChange} activeFilter={activeFilter} />


            {/* 
            Якщо помилка - показуэмо повідомлення. Якщо процес завандаження - спіннер. 
            Якшо монети завантажені - рендеримо список.
            */}

            {error
                ? <p className="search-panel-err">An error occurred, please try later...</p>

                : coinsLoaded
                    ? (filteredCoins.length > 0
                        ? <VirtualScroll
                            ref={scrollDiv}
                            coins={filteredCoins.length ? filteredCoins : coins}
                            itemHeight={40}
                            visibleRows={8}
                            renderedRows={10}
                            onFavoriteChange={onFavoriteChange} />
                        : <div className="empty-list-msg">No matches or coins added to selected...</div>)
                    : <Spinner />}
        </div>
    )
}

export default SearchPanel;