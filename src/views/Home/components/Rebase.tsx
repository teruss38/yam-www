import React, { useCallback, useEffect, useState } from 'react'

import Countdown, { CountdownRenderProps} from 'react-countdown'
import {
  Box,
  Button,
  Card,
  CardContent,
  Spacer,
} from 'react-neu'
import styled from 'styled-components'

import Dial from 'components/Dial'
import Label from 'components/Label'

import useYam from 'hooks/useYam'

import { getNextRebaseTimestamp } from 'yam-sdk/utils'

const Rebase: React.FC = () => {
  const yam = useYam()
  const [nextRebase, setNextRebase] = useState<number>()

  const fetchNextRebase = useCallback( async() => {
    if (!yam) return
    const nextRebaseTimestamp = await getNextRebaseTimestamp(yam)
    setNextRebase(nextRebaseTimestamp)
  }, [
    setNextRebase,
    yam
  ])

  useEffect(() => {
    if (yam) {
      fetchNextRebase()
    }
  }, [fetchNextRebase, yam])

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span>{paddedHours}:{paddedMinutes}:{paddedSeconds}</span>
    )
  }

  const dialValue = nextRebase ? (nextRebase * 1000 - Date.now()) / (1000 * 60 * 60 * 12) * 100 : 0

  return (
    <Card>
      <CardContent>
        <Box
          alignItems="center"
          justifyContent="center"
          row
        >
          <Dial size={240} value={dialValue}>
            <StyledCountdown>
              <StyledCountdownText>
                {!nextRebase ? '--' : (
                  <Countdown date={new Date(nextRebase * 1000)} renderer={renderer} />
                )}
              </StyledCountdownText>
              <Label text="Next rebase" />
            </StyledCountdown>
          </Dial>
        </Box>
        <Spacer />
        <Button disabled text="Rebase" variant="secondary" />
      </CardContent>
    </Card>
  )
}

const StyledCountdown = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCountdownText = styled.span`
  color: ${props => props.theme.colors.primary.main};
  font-size: 36px;
  font-weight: 700;
`

export default Rebase