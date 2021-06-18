import request from '@u/request'

// test

export const getCake = (params, mock = true) => {
  return request('get', '/cakeChart', params, mock)
}