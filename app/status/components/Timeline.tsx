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

interface Sents {
    files: [{ fileName: string, fileType: string, fileURL: string }];
    email: string;
    header: string;
    detail: string;
    status: string;
    date: string;
    from: [string];
}

interface TimelineProps {
    timeLine: Sents | undefined;
}

function Timeline({ timeLine }: TimelineProps) {

    console.log(timeLine);
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
                        ส่ง
                    </Typography>
                    <Typography>{timeLine?.from[0]}</Typography>
                </TimelineContent>
            </TimelineItem>
            {timeLine?.from.map((e, index) => (
                index === timeLine?.from.length - 1 ? (
                    <TimelineItem className=''>
                        <TimelineOppositeContent variant='h6' color='grey'>
                            9:30 am
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="grey" className='w-10 h-10' />
                            {/* <TimelineConnector className='w h-14' /> */}
                        </TimelineSeparator>
                        <TimelineContent >
                            <Typography variant="h6" component="span">
                                รอการตอบกลับ
                            </Typography>
                            <Typography>{timeLine?.email}</Typography>
                        </TimelineContent>
                    </TimelineItem >
                ) : (
                    <TimelineItem className=''>
                        <TimelineOppositeContent variant='h6' color='grey'>
                            9:30 am
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="success" className='w-10 h-10' />
                            {/* <TimelineConnector className='w h-14' /> */}
                        </TimelineSeparator>
                        <TimelineContent >
                            <Typography variant="h6" component="span">
                                ส่ง
                            </Typography>
                            <Typography>{e}</Typography>
                        </TimelineContent>
                    </TimelineItem >
                )
            ))
            }
        </MuiTimeline >

    )
}

export default Timeline
