import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

let store

const initialState = {
  myItems: [],
  saleItems: [],
  searchItems: [],
  processing: false,
  notification: {
    type: "",
    msg: ""
  },
  myProfile: {
    username: "",
    email: "",
    avatar: "/images/avatar_placeholder.png",
    description: ""
  },
  wallet: {
    address: "",
    starkPublicKey: "",
    walletName: ""
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MY_PROFILE_UPDATED': {
      return {
        ...state,
        myProfile: action.data
      }
    }
    case 'SET_NOTIFICATION': {
      return {
        ...state,
        notification: action.data
      }
    }
    case 'CLEAR_NOTIFICATION': {
      return {
        ...state,
        notification: {
          type: "",
          msg: ""
        }
      }
    }
    case 'SET_MY_ITEMS': {
      return {
        ...state,
        myItems: action.data
      }
    }
    case 'SET_SALE_ITEMS': {
      return {
        ...state,
        saleItems: action.data
      }
    }
    case 'SET_SEARCH_ITEMS': {
      return {
        ...state,
        searchItems: action.data
      }
    }
    case 'CREATE_ITEM': {
      const _my_items = [...state.myItems];
      _my_items.push(action.data);
      const _sale_items = [...state.saleItems];
      if (action.data.status === "sale") {
        _sale_items.push(action.data);
      }
      return {
        ...state,
        myItems: _my_items,
        saleItems: _sale_items
      }
    }
    case 'UPDATE_ITEM': {
      const _my_items = state.myItems.map(_item => {
        return (_item.id == action.data.id)? action.data: _item;
      });
      let _sale_items = [];
      if (action.data.status === "sale") {
        const _index = state.saleItems.filter(_item => _item.id === action.data.id);
        _sale_items = [...state.saleItems];
        if (_index.length < 1) {
          _sale_items.push(action.data);
        }
      } else {
        _sale_items = state.saleItems.filter(_item => _item.id !== action.data.id);
      }
      return {
        ...state,
        myItems: _my_items,
        saleItems: _sale_items
      }
    }
    case 'SET_PROCESSING': {
      return {
        ...state,
        processing: action.data
      }
    }
    case 'SET_WALLET_ADDRESS': {
      const { wallet } = action.data
      if (localStorage) {
        localStorage.setItem('WALLET_ADDRESS', wallet.address);
        localStorage.setItem('STARK_PUBLIC_KEY', wallet.starkPublicKey);
        localStorage.setItem('WALLET_NAME', wallet.walletName);
      }
      return {
        ...state,
        wallet: wallet
      }
    }
    case 'CLEAR_WALLET_ADDRESS': {
      localStorage.removeItem('WALLET_ADDRESS');
      localStorage.removeItem('STARK_PUBLIC_KEY');
      return {
        ...state,
        wallet: {
          address: "",
          starkPublicKey: ""
        }
      }
    }
    default:
      return state
  }
}

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  )
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
