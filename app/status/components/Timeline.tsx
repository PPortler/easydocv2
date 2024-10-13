"use client"

import React from 'react'
import MuiTimeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';

import Icon from '@mdi/react';
import { mdiArrowLeft, mdiStar } from '@mdi/js';

function Timeline() {
    return (
        <MuiTimeline position="alternate-reverse">
            <TimelineItem className=''>
                <TimelineOppositeContent variant='h6' color='grey'>
                    9:30 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="success" className='w-10 h-10' />
                    <TimelineConnector className='w h-14' />
                </TimelineSeparator>
                <TimelineContent >
                    <Typography variant="h6" component="span">
                        Sent
                    </Typography>
                    <Typography>Teacher somchai</Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem className=''>
                <TimelineOppositeContent variant='h6' color='grey'>
                    10:00 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="success" className='w-10 h-10' />
                    <TimelineConnector className='w h-14' />
                </TimelineSeparator>
                <TimelineContent >
                    <Typography variant="h6" component="span">
                        Start
                    </Typography>
                    <Typography>Teacher somchai</Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem className=''>
                <TimelineOppositeContent variant='h6' color='grey'>
                    10:00 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="success" className='w-10 h-10' />
                    <TimelineConnector className='w h-14' />
                </TimelineSeparator>
                <TimelineContent >
                    <Typography variant="h6" component="span">
                        Start
                    </Typography>
                    <Typography>Teacher somchai</Typography>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem className=''>
                <TimelineSeparator>
                    <TimelineDot color="grey" className='w-10 h-10' />
                </TimelineSeparator>
                <TimelineContent >
                    <Typography variant="h6" component="span">
                        Wait
                    </Typography>
                    <Typography>Teachet somsak</Typography>
                </TimelineContent>
            </TimelineItem>
        </MuiTimeline>

    )
}

export default Timeline
