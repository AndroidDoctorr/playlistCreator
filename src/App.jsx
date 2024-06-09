import { useState } from 'react'
import { OpenAI } from 'openai'
import { moods, interests, gptModels } from './utils/constants'
import { Form, Card, Spinner } from 'react-bootstrap'
import './App.css'

const apiKey = import.meta.env.VITE_API_KEY
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

// TODO:
// 1. Add a way to add the user's interests
//    e.g. checklists for genres, bands, songs to select from
//    OR input them directly
// 2. Add a way to choose the length of the playlist
// 3. Stream the response rather than waiting for the entire response to be generated
// 4. Better styling, use bootstrap more
// 5. Add a way to remove a song you don't like and replace it with a new one
// 6. Add a way to save the playlist to your Spotify account
// 7. Add a back-end to store the user's interests and generate a playlist from them
// 8. Move pieces into separate components
// 9. Add a way to choose the type of playlist (random, recommended, etc.)
// 10. Choose a different model?
// 11. Use other LLMs like llama, copilot, etc.?
// 12. Deploy it somewhere
// 13. Show ads!

function App() {
    const [mood, setMood] = useState('happy')
    const [temperature, setTemperature] = useState(0)
    // const [responseMessage, setResponseMessage] = useState(
    //     'Waiting to generate...'
    // )
    const [isGenerating, setIsGenerating] = useState(false)
    const [playlist, setPlaylist] = useState([])
    const [gptModel, setGptModel] = useState(gptModels[0])

    const generateMessages = () => [
        {
            role: 'system',
            content: `Your job is to create a Spotify playlist for the user that expands on their musical interests. This user's musical interests include ${interests.join(
                ', '
            )}. Try to branch out a bit, and suggest some new things, don't just give them what they already know. Only list the songs (with indices, like "1. [ARTIST] - [SONG]"), nothing else.`,
        },
        {
            role: 'user',
            content: `Create a playlist to suit my mood; I'm feeling ${mood}`,
        },
    ]

    const handleChatGPTCall = async () => {
        setIsGenerating(true)
        try {
            const response = await openai.chat.completions.create({
                model: gptModel,
                messages: generateMessages(),
                temperature,
            })
            handleResponseData(response)
        } catch (error) {
            console.error('Error calling OpenAI:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleResponseData = (data) => {
        const rawResponse = data.choices[0].message.content
        // setResponseMessage(rawResponse)
        parsePlaylist(rawResponse)
    }

    const parsePlaylist = (response) => {
        const songList = response
            .split(/\d+\./)
            .slice(1)
            .map((song) => song.trim())
        setPlaylist(songList)
    }

    return (
        <>
            <h3>Playlist Generator</h3>
            <div>
                <label htmlFor='mood-select'>{'Choose your mood: '}</label>
                <select
                    id='mood-select'
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                >
                    {moods.map((mood) => (
                        <option key={mood} value={mood}>
                            {mood}
                        </option>
                    ))}
                </select>
                <Form>
                    <Form.Label>Temperature: {temperature}</Form.Label>
                    <Form.Range
                        min='0.0'
                        max='1.0'
                        step='0.05'
                        value={temperature}
                        onChange={(e) =>
                            setTemperature(parseFloat(e.target.value))
                        }
                    />
                </Form>
                <select
                    id='model-select'
                    value={mood}
                    onChange={(e) => setGptModel(e.target.value)}
                >
                    {gptModels.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
                <br />
                <button disabled={isGenerating} onClick={handleChatGPTCall}>
                    {isGenerating ? 'Generating...' : 'Generate!'}
                </button>
            </div>
            <Card className='mt-3 p-3'>
                <Card.Body>
                    {isGenerating ? (
                        <>
                            <Spinner animation='border' role='status'></Spinner>
                            <p>{'Creating your playlist...'}</p>
                        </>
                    ) : playlist.length == 0 ? (
                        <span>{'Waiting to generate...'}</span>
                    ) : (
                        <ol>
                            {playlist.map((song, index) => (
                                <li key={`song-${index}`}>{`${song}`}</li>
                            ))}
                        </ol>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}

export default App
