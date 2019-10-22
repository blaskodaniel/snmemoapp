import { mount, shallow } from 'enzyme'
import React from 'react'
import Button from '@material-ui/core/Button'
import { NavBarComponent } from '../src/components/navbar'
import { RepositoryContext } from '../src/context/repository-provider'

describe('Navbar', () => {
  it('Navbar snapshot', () => {
    const wrapper = shallow(<NavBarComponent />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Logout test', () => {
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
