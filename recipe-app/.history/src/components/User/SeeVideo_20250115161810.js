import React, { useState, useEffect, useRef } from 'react';
import { Card, message, Row, Col, Spin, Button, Space } from 'antd';
import { Maximize2, Minimize2 } from 'lucide-react';
import axios from 'axios';

const SeeVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timers, setTimers] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [rewardedVideos, setRewardedVideos] = useState(new Set());
    const [playingVideos, setPlayingVideos] = useState(new Set());
    const [fullscreenVideo, setFullscreenVideo] = useState(null);
    const videoRefs = useRef({});

    useEffect(() => {
        fetchVideos();
        return () => {
            Object.values(timers).forEach(timer => clearInterval(timer));
        };
    }, []);

    const checkRewardStatus = async (videoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/videos/check-reward/${videoId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
    
            if (response.data.success && response.data.isRewarded) {
                setRewardedVideos(prev => new Set([...prev, videoId]));
            }
        } catch (error) {
            console.error('Check reward status error:', error);
        }
    };
    
    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');    
            const response = await axios.get('http://localhost:5000/api/videos/videos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.success) {
                setVideos(response.data.videos);
                const initialCountdowns = {};
                response.data.videos.forEach(async video => {
                    initialCountdowns[video._id] = 30;
                    await checkRewardStatus(video._id);
                });
                setCountdowns(initialCountdowns);
            }
        } catch (error) {
            message.error('Failed to fetch videos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayVideo = async (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            try {
                await videoElement.play();
                setPlayingVideos(prev => new Set([...prev, videoId]));
                
                if (!rewardedVideos.has(videoId) && !timers[videoId]) {
                    const timer = setInterval(() => {
                        setCountdowns(prev => {
                            const newCountdown = prev[videoId] - 1;
                            
                            if (newCountdown <= 0) {
                                clearInterval(timer);
                                awardXu(videoId);
                                return { ...prev, [videoId]: 0 };
                            }
                            
                            return { ...prev, [videoId]: newCountdown };
                        });
                    }, 1000);

                    setTimers(prev => ({ ...prev, [videoId]: timer }));
                }
            } catch (error) {
                message.error('Failed to play video: ' + error.message);
            }
        }
    };

    const handlePauseVideo = (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            videoElement.pause();
            setPlayingVideos(prev => {
                const newPlaying = new Set(prev);
                newPlaying.delete(videoId);
                return newPlaying;
            });
            
            if (timers[videoId] && !rewardedVideos.has(videoId)) {
                clearInterval(timers[videoId]);
                setTimers(prev => {
                    const newTimers = { ...prev };
                    delete newTimers[videoId];
                    return newTimers;
                });
            }
        }
    };

    const toggleFullscreen = (videoId) => {
        setFullscreenVideo(prev => prev === videoId ? null : videoId);
    };

    const awardXu = async (videoId) => {
        if (rewardedVideos.has(videoId)) return;
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/videos/award-xu',
                { videoId: videoId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data.success) {
                message.success(`Gift reward 100 xu! New balance: ${response.data.newBalance} xu 🎁`);
                setRewardedVideos(prev => new Set([...prev, videoId]));
            }
        } catch (error) {
            console.error('Award XU error:', error);
            if (error.response?.status === 400 && error.response?.data?.message.includes('Already received')) {
                setRewardedVideos(prev => new Set([...prev, videoId]));
            } else {
                message.error('Failed to award XU: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '24px' }}>Available Videos</h2>
            <Row gutter={[16, 16]}>
                {videos.map(video => (
                    <Col 
                        xs={24} 
                        sm={fullscreenVideo === video._id ? 24 : 12} 
                        md={fullscreenVideo === video._id ? 24 : 6} 
                        key={video._id}
                        className={fullscreenVideo === video._id ? 'fixed inset-0 z-50 bg-black p-0' : ''}
                    >
                        <Card 
                            title={fullscreenVideo !== video._id ? video.title : null}
                            style={{ 
                                height: fullscreenVideo === video._id ? '100vh' : '100%',
                                margin: fullscreenVideo === video._id ? 0 : undefined,
                                borderRadius: fullscreenVideo === video._id ? 0 : undefined
                            }}
                            bodyStyle={{ 
                                padding: '12px',
                                height: fullscreenVideo === video._id ? '100%' : 'auto'
                            }}
                        >
                            <div style={{ 
                                position: 'relative', 
                                width: '100%',
                                height: fullscreenVideo === video._id ? 'calc(100% - 60px)' : 'auto',
                                paddingBottom: fullscreenVideo === video._id ? 0 : '56.25%'
                            }}>
                                <video
                                    ref={el => videoRefs.current[video._id] = el}
                                    style={{
                                        position: fullscreenVideo === video._id ? 'relative' : 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        background: '#000'
                                    }}
                                    preload="metadata"
                                    onEnded={() => handlePauseVideo(video._id)}
                                >
                                    <source 
                                        src={`http://localhost:5000${video.videoPath}`}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginTop: '12px'
                            }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => handlePlayVideo(video._id)}
                                        disabled={rewardedVideos.has(video._id)}
                                    >
                                        {rewardedVideos.has(video._id) ? 'Rewarded' : 'Play'}
                                    </Button>
                                    <Button
                                        onClick={() => handlePauseVideo(video._id)}
                                        disabled={!playingVideos.has(video._id)}
                                    >
                                        Pause
                                    </Button>
                                    <Button
                                        onClick={() => toggleFullscreen(video._id)}
                                        icon={fullscreenVideo === video._id ? 
                                            <Minimize2 className="w-4 h-4" /> : 
                                            <Maximize2 className="w-4 h-4" />
                                        }
                                    >
                                        {fullscreenVideo === video._id ? 'Exit Fullscreen' : 'Fullscreen'}
                                    </Button>
                                </Space>
                                <div style={{ 
                                    fontWeight: 'bold',
                                    color: rewardedVideos.has(video._id) ? '#52c41a' : '#1890ff'
                                }}>
                                    {rewardedVideos.has(video._id) ? 
                                        'Completed! 🎁' : 
                                        `${countdowns[video._id]}s`
                                    }
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SeeVideo;