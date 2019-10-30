import { mount, shallow } from 'enzyme'
import React from 'react'
import Button from '@material-ui/core/Button'
import { NavBarComponent } from '../src/components/navbar'
import { RepositoryContext } from '../src/context/repository-provider'

describe('The navbar instance', () => {
  it('should renders correctly', () => {
    expect(shallow(<NavBarComponent />)).toMatchSnapshot()
  })

  it('should logout correctly', () => {
    const logoutfn = jest.fn()
    const wrapper = mount(
      <RepositoryContext.Provider value={{ authentication: { logout: logoutfn } } as any}>
        <NavBarComponent />
      </RepositoryContext.Provider>,
    )

    wrapper.find(Button).simulate('click')
    expect(logoutfn).toBeCalled()
  })
})
