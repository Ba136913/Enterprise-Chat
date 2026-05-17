/** @type {import('next').NextConfig} */
const nextConfig = {
    // Premium features like image optimization for Supabase storage
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
};

export default nextConfig;
