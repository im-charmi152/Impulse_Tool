import { useEffect, useRef, useState } from "react";

import {
  Search,
  Globe2,
  FileText,
  Clock3,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";

const RECENT_SEARCH_KEY = "impulse_recent_searches";

const COUNTRY_CODES = [
  "AT",
  "AX",
  "BI",
  "BL",
  "BP",
  "BR",
  "CH",
  "CN",
  "CP",
  "DE",
  "DK",
  "EH",
  "ES",
  "FI",
  "FR",
  "FT",
  "HK",
  "HU",
  "IA",
  "IN",
  "IT",
  "MD",
  "MX",
  "MY",
  "NO",
  "PT",
  "SE",
  "SG",
  "TH",
  "TW",
  "UK",
  "X5",
  "X6",
  "YM",
  "Z3",
];

/* =========================================================
   COUNTRY NAMES
   ========================================================= */

const COUNTRY_NAMES = {
  AT: "Austria",
  AX: "Åland Islands",
  BI: "Burundi",
  BL: "Saint Barthélemy",
  BR: "Brazil",
  CH: "Switzerland",
  CN: "China",
  DE: "Germany",
  DK: "Denmark",
  EH: "Western Sahara",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  HK: "Hong Kong",
  HU: "Hungary",
  IN: "India",
  IT: "Italy",
  MD: "Moldova",
  MX: "Mexico",
  MY: "Malaysia",
  NO: "Norway",
  PT: "Portugal",
  SE: "Sweden",
  SG: "Singapore",
  TH: "Thailand",
  TW: "Taiwan",
  UK: "United Kingdom",
};

/*
 * Codes such as BP, CP, FT, IA, X5, X6, YM and Z3
 * are left as codes because they may be application-specific.
 *
 * Add their real business names here if required.
 */

function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}


/* =========================================================
   RECENT SEARCHES
   ========================================================= */

function getRecentSearches() {
  try {
    const saved = localStorage.getItem(
      RECENT_SEARCH_KEY
    );

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}


function saveRecentSearch(searchItem) {
  try {
    const existing = getRecentSearches();

    // Remove duplicate
    const filtered = existing.filter(
      (item) =>
        !(
          item.poNumber === searchItem.poNumber &&
          item.countryCode === searchItem.countryCode
        )
    );

    const updated = [
      {
        ...searchItem,
        timestamp: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, 8);

    localStorage.setItem(
      RECENT_SEARCH_KEY,
      JSON.stringify(updated)
    );

    return updated;
  } catch {
    return [];
  }
}


/* =========================================================
   COUNTRY DROPDOWN
   ========================================================= */

function CountryDropdown({
  value,
  onChange,
  options,
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  /* -------------------------------------------------------
     CLOSE ON OUTSIDE CLICK
     ------------------------------------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  /* -------------------------------------------------------
     ESCAPE TO CLOSE
     ------------------------------------------------------- */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  /* -------------------------------------------------------
     FOCUS SEARCH WHEN OPEN
     ------------------------------------------------------- */

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open]);


  /* -------------------------------------------------------
     SELECTED COUNTRY
     ------------------------------------------------------- */

  const selectedCountry = options.find(
    (country) => country === value
  );


  /* -------------------------------------------------------
     FILTER OPTIONS
     ------------------------------------------------------- */

  const filteredOptions = options.filter(
    (country) => {
      const code = country.toLowerCase();

      const name = getCountryName(
        country
      ).toLowerCase();

      const query =
        searchValue.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        code.includes(query) ||
        name.includes(query)
      );
    }
  );


  /* -------------------------------------------------------
     SELECT COUNTRY
     ------------------------------------------------------- */

  const handleSelect = (country) => {
    onChange(country);

    setOpen(false);
    setSearchValue("");
  };


  /* -------------------------------------------------------
     TRIGGER KEYBOARD
     ------------------------------------------------------- */

  const handleTriggerKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      setOpen((current) => !current);
    }
  };


  return (
    <div
      ref={dropdownRef}
      className="dashboard-country-dropdown"
    >

      {/* =================================================
          TRIGGER
          ================================================= */}

      <button
        type="button"
        className={`dashboard-country-trigger ${
          open ? "is-open" : ""
        }`}
        onClick={() =>
          setOpen((current) => !current)
        }
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >

        <span className="dashboard-country-trigger-icon">
          <Globe2 size={15} />
        </span>


        {selectedCountry ? (
          <span className="dashboard-country-selected">

            <span className="dashboard-country-code">
              {selectedCountry}
            </span>

            <span className="dashboard-country-name">
              {getCountryName(
                selectedCountry
              )}
            </span>

          </span>
        ) : (
          <span className="dashboard-country-placeholder">
            Select Country Code
          </span>
        )}


        <ChevronDown
          size={15}
          className={`dashboard-country-chevron ${
            open ? "is-open" : ""
          }`}
        />

      </button>


      {/* =================================================
          DROPDOWN MENU
          ================================================= */}

      {open && (
        <div className="dashboard-country-menu">

          {/* SEARCH */}

          <div className="dashboard-country-search">

            <div className="dashboard-country-search-box">

              <Search size={13} />

              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
                placeholder="Search country or code..."
                autoComplete="off"
              />

            </div>

          </div>


          {/* OPTIONS */}

          <div
            className="dashboard-country-options"
            role="listbox"
          >

            {filteredOptions.length > 0 ? (

              filteredOptions.map(
                (country) => {
                  const isSelected =
                    country === value;

                  return (
                    <button
                      key={country}
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      className={`dashboard-country-option ${
                        isSelected
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelect(country)
                      }
                    >

                      {/* CODE */}

                      <span className="dashboard-country-option-code">
                        {country}
                      </span>


                      {/* NAME */}

                      <span className="dashboard-country-option-name">
                        {getCountryName(
                          country
                        )}
                      </span>


                      {/* CHECK */}

                      {isSelected && (
                        <span className="dashboard-country-check">
                          <Check size={11} />
                        </span>
                      )}

                    </button>
                  );
                }
              )

            ) : (

              <div className="dashboard-country-empty">

                <div className="dashboard-country-empty-icon">
                  <Search size={13} />
                </div>

                <span>
                  No country found
                </span>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   DASHBOARD SEARCH
   ========================================================= */

export default function DashboardSearch({
  onSearch,
  loading = false,
}) {
  const [poNumber, setPoNumber] =
    useState("");

  const [countryCode, setCountryCode] =
    useState("");

  const [recentSearches, setRecentSearches] =
    useState([]);


  /* =======================================================
     LOAD RECENT SEARCHES
     ======================================================= */

  useEffect(() => {
    setRecentSearches(
      getRecentSearches()
    );
  }, []);


  /* =======================================================
     VALIDATION
     ======================================================= */

  const canSearch =
    poNumber.trim().length > 0 &&
    countryCode.trim().length > 0 &&
    !loading;


  /* =======================================================
     SUBMIT SEARCH
     ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    const searchData = {
      poNumber: poNumber.trim(),
      countryCode:
        countryCode.trim().toUpperCase(),
    };

    const updated =
      saveRecentSearch(searchData);

    setRecentSearches(updated);

    if (onSearch) {
      await onSearch(searchData);
    }
  };


  /* =======================================================
     RECENT SEARCH
     ======================================================= */

  const handleRecentSearch = async (
    item
  ) => {
    setPoNumber(item.poNumber);

    setCountryCode(item.countryCode);

    if (onSearch) {
      await onSearch({
        poNumber: item.poNumber,
        countryCode: item.countryCode,
      });
    }
  };


  return (
    <section className="dashboard-search-area">

      {/* ===================================================
          DECORATIVE BACKGROUND
          =================================================== */}

      <div className="search-decoration search-decoration-left">

        <span className="search-decoration-line line-1" />

        <span className="search-decoration-dot dot-1" />

        <span className="search-decoration-dot dot-2" />

      </div>


      <div className="search-decoration search-decoration-right">

        <span className="search-decoration-line line-2" />

        <span className="search-decoration-dot dot-3" />

        <span className="search-decoration-dot dot-4" />

      </div>


      <div className="search-glow search-glow-left" />

      <div className="search-glow search-glow-right" />


      {/* ===================================================
          SEARCH CARD
          =================================================== */}

      <div className="dashboard-search-card">

        {/* TITLE */}

        <div className="dashboard-search-title">

          <div className="dashboard-search-icon">
            <Sparkles size={17} />
          </div>

          <div>

            <h2>
              Search Investigation
            </h2>

            <p>
              Search by Customer PO Number and Country Code
            </p>

          </div>

        </div>


        {/* =================================================
            FORM
            ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="dashboard-search-form"
        >

          {/* =================================================
              CUSTOMER PO
              ================================================= */}

          <div className="dashboard-search-field">

            <label>
              Customer PO Number
            </label>

            <div className="dashboard-input">

              <FileText size={15} />

              <input
                type="text"
                value={poNumber}
                onChange={(event) =>
                  setPoNumber(
                    event.target.value
                  )
                }
                placeholder="Enter Customer PO Number"
                maxLength={24}
                autoComplete="off"
              />

            </div>

          </div>


          {/* =================================================
              COUNTRY
              ================================================= */}

          <div className="dashboard-search-field">

            <label>
              Country Code
            </label>

            <CountryDropdown
              value={countryCode}
              onChange={setCountryCode}
              options={COUNTRY_CODES}
            />

          </div>


          {/* =================================================
              SEARCH BUTTON
              ================================================= */}

          <button
            type="submit"
            disabled={!canSearch}
            className="dashboard-search-button"
          >

            {loading ? (
              <>
                <span className="search-spinner" />

                <span>
                  Investigating...
                </span>
              </>
            ) : (
              <>
                <span>
                  Search Order
                </span>

                <Search size={15} />
              </>
            )}

          </button>

        </form>


        {/* =================================================
            RECENT SEARCHES
            ================================================= */}

        <div className="dashboard-recent">

          <div className="dashboard-recent-label">

            <Clock3 size={14} />

            <span>
              Recent Searches
            </span>

          </div>


          <div className="dashboard-recent-list">

            {recentSearches.length === 0 ? (

              <span className="dashboard-no-recent">
                Recent investigations will appear here
              </span>

            ) : (

              recentSearches
                .slice(0, 5)
                .map((item, index) => (

                  <button
                    key={`${item.poNumber}-${item.countryCode}-${index}`}
                    type="button"
                    className="dashboard-recent-chip"
                    onClick={() =>
                      handleRecentSearch(
                        item
                      )
                    }
                  >

                    <Search size={11} />

                    <span>
                      {item.poNumber}
                    </span>

                    <span className="dashboard-recent-country">
                      {item.countryCode}
                    </span>

                  </button>

                ))

            )}

          </div>

        </div>

      </div>

    </section>
  );
}