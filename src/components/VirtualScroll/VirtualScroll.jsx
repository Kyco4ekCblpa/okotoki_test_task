import React, { useState } from "react";

import "./virtualScroll.css";
import StarIcon from "../StarIcon/StarIcon";

const VirtualScroll = React.forwardRef(({ coins, itemHeight, visibleRows, renderedRows, onFavoriteChange }, ref) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const onScroll = (e) => {
        const newScrollPosition = Math.floor(e.target.scrollTop / itemHeight) * itemHeight;
        setScrollPosition(newScrollPosition);
    };

    const startIndex = Math.floor(scrollPosition / itemHeight);
    const endIndex = Math.min(startIndex + renderedRows, coins.length);

    const items = coins.slice(startIndex, endIndex).map((item, i) => (
        <a
            className="virtual-scroll-item"
            tabIndex={0}
            key={startIndex + i}
            href="#"
            style={{ height: itemHeight }}>

            <div className="item-wrapper">
                <StarIcon
                    dataId={item}
                    onFavoriteChange={onFavoriteChange}
                />

                {item}
            </div>
        </a>
    ));

    const spacerTopHeight = startIndex * itemHeight;
    const spacerBottomHeight = (coins.length - endIndex) * itemHeight;

    return (
        <ul
            ref={ref}
            className="virtual-scroll-container"
            onScroll={onScroll}
            style={{ overflow: 'auto', height: visibleRows * itemHeight + 20 }}>

            <div style={{ height: spacerTopHeight }} />
            {items}
            <div style={{ height: spacerBottomHeight }} />
        </ul>
    );
});

export default VirtualScroll;