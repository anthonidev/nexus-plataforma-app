import { usePointsUser } from '@/hooks/usePointsUser';
import React from 'react'

type Props = {}

const PointsIcon = (props: Props) => {
    const {
        points,
    } = usePointsUser();
    return (
        <div>{points.availablePoints}</div>
    )
}

export default PointsIcon