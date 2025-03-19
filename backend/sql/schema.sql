DROP TABLE IF EXISTS video CASCADE;

DROP TABLE IF EXISTS lesson CASCADE;

CREATE TABLE video (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB
);

CREATE TABLE lesson (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES video(id) ON DELETE CASCADE,
    data JSONB,
    created TIMESTAMP DEFAULT NOW()
);
