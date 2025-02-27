import React, { useState } from "react";
import "./Styles/SecondaryNavbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const SecondaryNavbar = ({ currentCategory, onSortSelect, onFilterSelect }) => {
  const [showMaterialSubMenu, setShowMaterialSubMenu] = useState(false);

  return (
    <div className="secondary-navbar-container">
      <div className="category-name">{currentCategory}</div>
      <div className="action-buttons">
        {/* Sort Dropdown */}
        <div
          className="secondary-navbar-menu"
          onMouseEnter={() => document.querySelector(".sort-menu").classList.add("visible")}
          onMouseLeave={() => document.querySelector(".sort-menu").classList.remove("visible")}
        >
          <div className="menu-button">Sort By
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
          <div className="dropdown-menu sort-menu">
            <div className="dropdown-item" onClick={() => onSortSelect("price_low_high")}>
              Price: Low to High
            </div>
            <div className="dropdown-item" onClick={() => onSortSelect("price_high_low")}>
              Price: High to Low
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div
          className="secondary-navbar-menu"
          onMouseEnter={() => document.querySelector(".filter-menu").classList.add("visible")}
          onMouseLeave={() => document.querySelector(".filter-menu").classList.remove("visible")}
        >
          <div className="menu-button">Filter By
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
          <div className="dropdown-menu filter-menu">
            <div className="dropdown-item" onClick={() => onFilterSelect("low_carbon_footprint")}>
              Low Carbon Footprint
            </div>
            <div
              className="dropdown-item material-sourcing"
              onMouseEnter={() => setShowMaterialSubMenu(true)}
              onMouseLeave={() => setShowMaterialSubMenu(false)}
            >
              Material Sourcing
              
              {showMaterialSubMenu && (
                <div className="submenu">
                  <div className="dropdown-item" onClick={() => onFilterSelect("material_sourcing_good")}>
                    Good
                  </div>
                  <div className="dropdown-item" onClick={() => onFilterSelect("material_sourcing_better")}>
                    Better
                  </div>
                  <div className="dropdown-item" onClick={() => onFilterSelect("material_sourcing_best")}>
                    Best
                  </div>
                </div>
              )}
            </div>
            <div className="dropdown-item" onClick={() => onFilterSelect("high_recyclability")}>
              High Recyclability
            </div>
            <div className="dropdown-item" onClick={() => onFilterSelect("low_water_usage")}>
              Low Water Usage
            </div>
            <div className="dropdown-item" onClick={() => onFilterSelect("high_energy_efficiency")}>
              High Energy Efficiency
            </div>
            <div className="dropdown-item" onClick={() => onFilterSelect("high_biodegradability")}>
              High Biodegradability
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
