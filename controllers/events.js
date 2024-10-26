const {response} = require('express')
const Event = require('../models/Event')

const getEvent = async(req, res = response) =>{

    const event = await Event.find().populate('user','name')

    res.status(201).json({
        ok: true,
        event
    })

}

const createEvent = async (req, res = response) =>{

    const event = new Event(req.body)

    try {
        
        event.user = req.uid

        const savedEvent = await event.save()

        res.status(201).json({
            ok: true,
            event: savedEvent,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the Administrator',
        })
    }
}


const updateEvent = async(req, res = response) =>{

    const eventId = req.params.id
    const uid = req.uid
    try {

        const event = await Event.findById(eventId)

        if(!event){ 
            return res.status(404).json({
                ok: false,
                msg: 'Event not found by Id',
            })
        }

        if( event.user.toString() != uid){
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized to update this event',
            })  
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new : true} )
        
        res.status(200).json({
            ok: true,
            event: updatedEvent,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the Administrator',
        })
    }

}


const deleteEvent = async(req, res = response) =>{

    const eventId = req.params.id
    const uid = req.uid
    
    try {

        const event = await Event.findById(eventId)

        if(!event){ 
            return res.status(404).json({
                ok: false,
                msg: 'Event not found by Id',
            })
        }

        if( event.user.toString() != uid){
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized to delete this event',
            })  
        }


        await Event.findByIdAndDelete( eventId  )
        
        res.status(200).json({
            ok: true,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the Administrator',
        })
    }

}

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
}

