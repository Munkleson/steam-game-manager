//// Levenshtein function sits here until I can figure out how to import it from elsewhere
(function(root, factory){
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(function(){
      return factory(root);
    });
  } else if (typeof module == 'object' && module && module.exports) {
    module.exports = factory(root);
  } else {
    root.Levenshtein = factory(root);
  }
}(this, function(root){

  function forEach( array, fn ) { var i, length
    i = -1
    length = array.length
    while ( ++i < length )
      fn( array[ i ], i, array )
  }

  function map( array, fn ) { var result
    result = Array( array.length )
    forEach( array, function ( val, i, array ) {
      result[i] = fn( val, i, array )
    })
    return result
  }

  function reduce( array, fn, accumulator ) {
    forEach( array, function( val, i, array ) {
      accumulator = fn( val, i, array )
    })
    return accumulator
  }

  // Levenshtein distance
  function Levenshtein( str_m, str_n ) { var previous, current, matrix
    // Constructor
    matrix = this._matrix = []

    // Sanity checks
    if ( str_m == str_n )
      return this.distance = 0
    else if ( str_m == '' )
      return this.distance = str_n.length
    else if ( str_n == '' )
      return this.distance = str_m.length
    else {
      // Danger Will Robinson
      previous = [ 0 ]
      forEach( str_m, function( v, i ) { i++, previous[ i ] = i } )

      matrix[0] = previous
      forEach( str_n, function( n_val, n_idx ) {
        current = [ ++n_idx ]
        forEach( str_m, function( m_val, m_idx ) {
          m_idx++
          if ( str_m.charAt( m_idx - 1 ) == str_n.charAt( n_idx - 1 ) )
            current[ m_idx ] = previous[ m_idx - 1 ]
          else
            current[ m_idx ] = Math.min
              ( previous[ m_idx ]     + 1   // Deletion
              , current[  m_idx - 1 ] + 1   // Insertion
              , previous[ m_idx - 1 ] + 1   // Subtraction
              )
        })
        previous = current
        matrix[ matrix.length ] = previous
      })

      return this.distance = current[ current.length - 1 ]
    }
  }

  Levenshtein.prototype.toString = Levenshtein.prototype.inspect = function inspect ( no_print ) { var matrix, max, buff, sep, rows
    matrix = this.getMatrix()
    max = reduce( matrix,function( m, o ) {
      return Math.max( m, reduce( o, Math.max, 0 ) )
    }, 0 )
    buff = Array( ( max + '' ).length ).join( ' ' )

    sep = []
    while ( sep.length < (matrix[0] && matrix[0].length || 0) )
      sep[ sep.length ] = Array( buff.length + 1 ).join( '-' )
    sep = sep.join( '-+' ) + '-'

    rows = map( matrix, function( row ) { var cells
      cells = map( row, function( cell ) {
        return ( buff + cell ).slice( - buff.length )
      })
      return cells.join( ' |' ) + ' '
    })

    return rows.join( "\n" + sep + "\n" )
  }

  Levenshtein.prototype.getMatrix = function () {
    return this._matrix.slice()
  }

  Levenshtein.prototype.valueOf = function() {
    return this.distance
  }

  return Levenshtein

}));

function loadSearchFunctionLogic() {
  const input = document.querySelector("#search-input")
  const form = document.querySelector("#search-form")

  let gameList;
  let alphabetArray;
  let initialSearchSet = false;
  let initialSearchResults;

  // const searchDiv = document.querySelector("#search-div");
  const searchDropdown = document.querySelector("#search-dropdown");

  // for when I can retrieve details through the frontend, not backend
  // const gameList = fetch("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json")
  //   .then(response => response.json())
  //   .then(data => data);
  // console.log(gameList);

  input.addEventListener("keyup", (event) => {
    // loadGameList();
    searchDropdown.innerHTML = "";

    let input = event.currentTarget.value;
    if (input.length >= 4) {
      // if (!initialSearchSet) {
      //   initialSearchResults = alphabetMatch(input);
      //   initialSearchSet = true;
      // }
      // const orderedSearchResults = orderedSearch(input, initialSearchResults)
      // displayDropdown(orderedSearchResults);
      // if (input[0] !== "t" && input[1] !== "h" && input[2] !== "e" && input[4] !== " "){

      // }

      const params = new URLSearchParams({ input: input }).toString();
      fetch(`/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => response.json())
      .then(data => {
        const orderedSearchResults = orderedSearch(input, data)
        displayDropdown(orderedSearchResults);
      })
      .catch(error => console.error('Error:', error));
    } else if (input.length < 3) {
      initialSearchResults = "";
      initialSearchSet = false;
    }
  });

  function loadGameList() {
    if (!gameList) {
      const dataGameList = document.querySelector("#data-game-list");
      gameList = JSON.parse(dataGameList.dataset.info);
      gameList = removeDuplicates(gameList);
      // gameList = gameList.sort((a, b) => a.appid - b.appid) // sort by appid
      gameList = gameList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
    }
    const dataAlphabetArray = document.querySelector("#data-alphabet-array");
    alphabetArray = JSON.parse(dataAlphabetArray.dataset.info);
  }

  function removeDuplicates(gameList) {
    const seen = new Set();
    return gameList.filter(game => {
      const duplicate = seen.has(game.appid);
      seen.add(game.appid);
      return !duplicate;
    })
  }

  function orderedSearch(input, games) {
    const filteredList = games.filter(game => {
      if (game.name) {
        return minimalizeWord(game.name).toLowerCase().includes(minimalizeWord(input).toLowerCase());
      }
    });
    return filteredList.sort((a, b) => new Levenshtein(a.name, input) > new Levenshtein(b.name, input) ? 1 : -1)
  }

  function alphabetMatch(input) {
    const startIndex = gameList.findIndex(game => game.name.slice(0, input.length).toLowerCase() === input.toLowerCase())
    const firstLetter = input[0].toLowerCase();
    const nextLetter = alphabetArray[alphabetArray.findIndex(letter => letter === firstLetter) + 1];
    const endIndex = gameList.findIndex(game => {
      if (game.name[0]) {
        return game.name[0].toLowerCase() === nextLetter;
      }
      return game.name[0] === nextLetter;
    });
    return gameList.slice(startIndex, endIndex);
  }

  function displayDropdown(filteredList) {
    const maxTenResults = filteredList.length >= 10 ? 10 : filteredList.length;
    for (let index = 0; index < maxTenResults; index++) {
      const dropdownOption = document.createElement("div");
      dropdownOption.innerText = filteredList[index].name;
      dropdownOption.classList.add("dropdown-item");
      // Will have to add
      dropdownOption.addEventListener("click", (event) => selectDropdownItem(event.currentTarget));

      searchDropdown.append(dropdownOption)
    }
  }

  function selectDropdownItem(target) {
    input.value = target.innerText;
  }

  function minimalizeWord(word) {
    const split = word.split("");
    const regex = new RegExp(/\w/);
    return split.filter(letter => regex.test(letter)).join("");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    //// logic for form validation here. If it is valid, then submit, else display errors
    const game = gameList.find(game => minimalizeWord(game.name.toLowerCase()) === minimalizeWord(input.value.toLowerCase()));
    const appidParam = document.querySelector("#hidden-appid");
    appidParam.value = game.appid;
    input.value = game.name;
    form.submit();
    input.select();
  });
}

loadSearchFunctionLogic();
