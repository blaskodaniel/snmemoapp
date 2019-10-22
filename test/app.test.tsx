import { shallow } from 'enzyme'
import React from 'react'
import { App } from '../src/app'

describe('Layout', () => {
  it('App component snapshot', () => {
    const l = shallow(<App />)
    expect(l).toMatchSnapshot()
  })
})
