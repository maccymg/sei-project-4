import Team from '../models/team.js'
import { notFound, forbidden } from '../lib/errorHandler.js'

async function teamIndex(_req, res, next) {
  try {
    const players = await Team.find().populate('midfielders').populate('attackers').populate('defenders').populate('goalkeeper').populate('owner')
    return res.status(200).json(players)
  } catch (err) {
    next(err)
  }
}

async function teamShow(req, res, next) {
  const { id } = req.params
  try {
    const player = await Team.findById(id).populate('midfielders').populate('attackers').populate('defenders').populate('goalkeeper').populate('owner')
    if (!player) throw new Error(notFound)
    return res.status(200).json(player)
  } catch (err) {
    next(err)
    return res.status(404).json({ 'message': 'Not Found' })
  }
}

async function teamCreate(req, res, next) {
  try {
    const newTeamData = { ...req.body, owner: req.currentUser._id }
    const newTeam = await Team.create(newTeamData)
    const popTeam = await Team.findById(newTeam.id).populate('midfielders').populate('attackers').populate('defenders').populate('goalkeeper').populate('owner')
    return res.status(201).json(popTeam)
  } catch (err) {
    next(err)
  }
}

async function teamDelete(req, res, next) {
  const { id } = req.params
  try {
    const teamToDelete = await Team.findById(id)
    if (!teamToDelete) throw new Error(notFound)
    if (!teamToDelete.owner.equals(req.currentUser._id)) throw new Error(forbidden)
    await teamToDelete.remove()
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

async function teamCommentCreate(req, res, next) {
  const { id } = req.params
  try {
    const team = await Team.findById(id)
    if (!team) throw new Error(notFound)
    const newComment = { ...req.body, owner: req.currentUser._id }
    team.comments.push(newComment)
    // const comments = team.comments
    // console.log(comments)
    // const popComment = await Team.findById(id).populate('comments.owner')
    // console.log(popComment)
    // team.comment[comments.length - 1] = popComment
    // console.log(popComment)
    await team.save()
    return res.status(201).json(team)
  } catch (err) {
    next(err)
  }
}

async function teamCommentDelete(req, res, next) {
  const { id, commentId } = req.params
  try {
    const team = await Team.findById(id)
    if (!team) throw new Error(notFound)
    const commentToDelete = team.comments.id(commentId)
    if (!commentToDelete) throw new Error(notFound)
    if (!commentToDelete.owner.equals(req.currentUser._id)) throw new Error(forbidden)
    await commentToDelete.remove()
    await team.save()
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}



export default {
  index: teamIndex,
  show: teamShow,
  create: teamCreate,
  delete: teamDelete,
  commentCreate: teamCommentCreate,
  commentDelete: teamCommentDelete,
}