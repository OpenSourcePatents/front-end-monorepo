'use client'

import { AuthModal, Loader, SpacedText } from '@zooniverse/react-components'
import { Box, Button } from 'grommet'
import { useState } from 'react'

function AuthenticatedUsersPageContainer({
  adminMode,
  children,
  isLoading,
  login,
  user
}) {
  const [authModalActiveIndex, setAuthModalActiveIndex] = useState(-1)

  if (isLoading) {
    return (
      <Box as='main' height='100vh' align='center' justify='center'>
        <Loader />
      </Box>
    )
  }

  if ((!user || Object.keys(user).length === 0)) {
    return (
      <Box as='main' height='100vh' align='center' justify='center'>
        <AuthModal
          activeIndex={authModalActiveIndex}
          closeModal={() => setAuthModalActiveIndex(-1)}
          onActive={setAuthModalActiveIndex}
        />
        <Button
          label='Please log in.'
          onClick={() => setAuthModalActiveIndex(0)}
          primary
        />
      </Box>
    )
  }

  if (user && login !== user?.login && !adminMode) {
    return (
      <Box as='main' height='100vh' align='center' justify='center'>
        <SpacedText uppercase={false}>
          Not authorized.
        </SpacedText>
      </Box>
    )
  }

  return <>{children}</>
}

export default AuthenticatedUsersPageContainer
