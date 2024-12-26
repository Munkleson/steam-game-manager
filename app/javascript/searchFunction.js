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

const input = document.querySelector("#search-input")
const form = document.querySelector("#search-form")

let gameList;

const searchDiv = document.querySelector("#search-div");
const searchDropdown = document.querySelector("#search-dropdown");



// const gameList = fetch("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json")
//   .then(response => response.json())
//   .then(data => data);
// console.log(gameList);

input.addEventListener("keyup", (event) => {
  loadGameList();
  searchDropdown.innerHTML = "";

  let input = event.currentTarget.value;

  const filteredList = filterSearchResults(input);
  displayDropdown(filteredList);
});

function loadGameList() {
  if (!gameList) {
    const dataContainer = document.querySelector("#data-container");
    gameList = JSON.parse(dataContainer.dataset.info);
    gameList = removeDuplicates(gameList);
    // Sort functions needed only for dev, not live
    // gameList = gameList.sort((a, b) => a.appid - b.appid) // sort by appid
    // gameList = gameList.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1)
  }
}

function removeDuplicates(gameList) {
  const seen = new Set();
  return gameList.filter(game => {
    const duplicate = seen.has(game.appid);
    seen.add(game.appid);
    return !duplicate;
  })
}

function filterSearchResults(input) {
  // const length = input.length;
  // const index = gameList.findIndex(element => element.name.slice(0, length).toLowerCase() === input.toLowerCase())
  // const filteredList = gameList.filter(element => element.name.slice(0, length).toLowerCase() === input.toLowerCase());
  const filteredList = gameList.filter(game => {
    if (game.name) {
      // return removeNonEligibleCharacters(game.name).toLowerCase() === removeNonEligibleCharacters(input).toLowerCase();
      return removeNonEligibleCharacters(game.name).toLowerCase().includes(removeNonEligibleCharacters(input).toLowerCase());
      // console.log(new Levenshtein(removeNonEligibleCharacters(game.name).toLowerCase(), removeNonEligibleCharacters(input).toLowerCase()).distance < 3)
      // return new Levenshtein(removeNonEligibleCharacters(game.name).toLowerCase(), removeNonEligibleCharacters(input).toLowerCase()).distance < 3
    }
  });
  // return filteredList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  return filteredList.sort((a, b) => new Levenshtein(a, input) > new Levenshtein(b, input) ? 1 : -1)
};

function displayDropdown(filteredList) {
  const maxTenResults = filteredList.length >= 10 ? 10 : filteredList.length;
  for (let index = 0; index < maxTenResults; index++) {
    const dropdownOption = document.createElement("div");
    dropdownOption.innerText = filteredList[index].name;
    searchDropdown.append(dropdownOption)
  }
}

function removeNonEligibleCharacters(word) {
  const split = word.split("");
  const regex = new RegExp(/\S/);
  return split.filter(letter => regex.test(letter)).join("");
}
