import { FaqCategory } from '../components/FaqSection';

export interface SeoData {
  title: string;
  description: string;
  schema: any;
  faq: FaqCategory[];
}

export const OVERRIDE_SEO_DATA: Record<string, Partial<SeoData>> = {
  'image-compressor': {
    title: 'Free Image Compressor - Compress JPEG & PNG | Tool Cabinet',
    description: 'Compress JPEG, PNG, and WebP images locally in your browser. 100% offline, no file size limits, and no server uploads. Fast, free, and private.',
    faq: [
      {
        category: 'Quick Start',
        items: [
          {
            question: 'How to compress images locally on Windows, Mac, or mobile?',
            answer: 'You can compress images locally by simply dragging and dropping them into our Tool Cabinet Image Compressor. Our tool runs completely client-side in your web browser. This means the compression algorithms execute directly on your CPU/GPU using HTML5 Canvas and Web Workers, without transmitting any image bytes over the internet. It works instantly on Windows, macOS, Linux, iOS, and Android.'
          },
          {
            question: 'What image file formats are supported for compression?',
            answer: 'Our tool supports a wide range of formats including JPEG, PNG, WebP, AVIF, and GIF. You can convert formats during compression (e.g. PNG to WebP) or keep the original formats. The tool offers lossy compression for maximum size reduction, and lossless compression for preserving pixel-perfect quality.'
          }
        ]
      },
      {
        category: 'Privacy & Security',
        items: [
          {
            question: 'Why is client-side image compression safer and more private?',
            answer: 'Standard online image compressors require you to upload your files to remote cloud servers, which exposes your private photos, documents, and assets to security vulnerabilities, hacking, and potential data harvesting. Tool Cabinet is 100% serverless and private; your files never leave your device. The image processing is fully offline, keeping your photos secure from server tracking or interceptors.'
          }
        ]
      },
      {
        category: 'Limits & Pricing',
        items: [
          {
            question: 'Are there any file size limits or batch restrictions?',
            answer: 'No. Because the processing occurs on your local device rather than using paid cloud servers, we do not impose any artificial caps. There are no file size limits, and you can compress unlimited batches of images simultaneously. You can load 50+ images at once, adjust settings, and download them all as a single, compressed ZIP file instantly.'
          }
        ]
      }
    ]
  },
  'video-transcoder': {
    title: 'Free Video Transcoder & Converter - MP4, WebM | Tool Cabinet',
    description: 'Convert MP4, WebM, and GIF files locally using multi-threaded WebAssembly. 100% offline, zero server uploads, and no file size limits. Fast & private.',
    faq: [
      {
        category: 'Technology',
        items: [
          {
            question: 'How to convert MP4 to WebM or GIF in the browser?',
            answer: 'Tool Cabinet uses a compiled WebAssembly port of FFmpeg (the industry-standard video library) to decode and encode videos directly in your browser. Since the video transcoding runs locally on your computer via multi-threaded WASM, you do not need to upload large files, saving you gigabytes of bandwidth and ensuring immediate speed.'
          },
          {
            question: 'What video formats and codecs does the browser transcoder support?',
            answer: 'The browser transcoder supports transcoding between popular formats like MP4 (H.264), WebM (VP9), and animated GIF. You can customize the resolution, aspect ratio, frame rate, and bitrate to optimize output file sizes for web embedding, presentations, or sharing.'
          }
        ]
      },
      {
        category: 'Privacy Standards',
        items: [
          {
            question: 'Is local video conversion private?',
            answer: 'Absolutely. Traditional video conversion websites process your video uploads on their backend servers, which could store or analyze your video content. With Tool Cabinet, the video file stays entirely inside your browser memory. No data is transmitted to the cloud, making it the most secure and private video converter online.'
          }
        ]
      },
      {
        category: 'Usage & Constraints',
        items: [
          {
            question: 'Is there a limit on video file size or conversion counts?',
            answer: 'No. Cloud-based video converters usually restrict you to 50MB or 100MB files, forcing you to pay for subscriptions. Because Tool Cabinet processes everything inside your browser on your hardware, we have zero file size limits and zero usage caps. You can convert files of any size without paying a dime.'
          }
        ]
      }
    ]
  },
  'background-remover': {
    title: 'Free AI Background Remover | High-Res & Offline | Tool Cabinet',
    description: 'Remove image backgrounds instantly using local AI. No paywalls, no resolution limits, and zero server tracking. Keep your photos private.',
    faq: [
      {
        category: 'AI Engine',
        items: [
          {
            question: 'How to remove image backgrounds offline using local AI?',
            answer: 'Our Background Remover leverages on-device Machine Learning models (running via WebGPU/ONNX Runtime in your browser) to detect the foreground subjects and separate them from the background. The entire neural network execution runs locally on your graphic card or processor, ensuring instant results without server lag.'
          },
          {
            question: 'Can I remove backgrounds from multiple images at once?',
            answer: 'Yes, our Tool Cabinet Background Remover supports batch processing. You can drop multiple images into the workspace, and the AI model will queue them for local segmentation. You can then review and download them as high-quality transparent PNGs in one click.'
          }
        ]
      },
      {
        category: 'Resolution & Quality',
        items: [
          {
            question: 'Does this background remover shrink my output resolution?',
            answer: 'No. Most background removers download a low-resolution thumbnail for free and charge you to download the high-resolution version. Tool Cabinet processes the image at its native, full resolution. Since we do not pay for cloud GPU costs (it runs on your device), we provide full-resolution transparent PNG downloads completely free.'
          }
        ]
      },
      {
        category: 'Data Sovereignty',
        items: [
          {
            question: 'Why is client-side AI safer for photo editing?',
            answer: 'Uploading photos of yourself, family, or sensitive products to external AI databases poses massive privacy risks. With our local AI background remover, your photos are never uploaded, stored, or reviewed. Everything occurs locally in the sandbox of your browser, making it the safest solution for privacy-conscious users.'
          }
        ]
      }
    ]
  },
  'image-converter': {
    title: 'Free Image Converter & HEIC to JPG | Tool Cabinet',
    description: 'Convert JPG, PNG, WebP, and HEIC images instantly in your browser. 100% offline, no file size limits, and no server uploads. Fast and private.',
    faq: [
      {
        category: 'Compatibility',
        items: [
          {
            question: 'How to convert HEIC to JPG on Windows or Mac offline?',
            answer: 'Windows users often struggle to open iPhone HEIC images. Our tool lets you convert HEIC to JPG or PNG directly in your browser. By dragging your HEIC files into the converter, it parses the image structure locally and uses the browser canvas to output standard JPEG, PNG, or WebP files instantly.'
          },
          {
            question: 'Which formats can I convert between?',
            answer: 'You can convert images bidirectionally between PNG, JPEG/JPG, WebP, HEIC, AVIF, BMP, and GIF. The tool also lets you adjust output quality for lossy formats to balance file size and visual fidelity.'
          }
        ]
      },
      {
        category: 'Sovereignty',
        items: [
          {
            question: 'Is my data secure when converting HEIC/WebP files?',
            answer: 'Yes, your files are completely safe because they never leave your device. The conversion occurs entirely within your browser memory. There are no server uploads, meaning your personal photos and sensitive documents are never tracked or saved by third parties.'
          }
        ]
      },
      {
        category: 'Batch Conversion',
        items: [
          {
            question: 'Is there a limit to how many images I can convert?',
            answer: 'No, there are no limits on the file sizes or the number of images you can convert. You can convert 100+ images in a single session. Since the process runs offline and is completely client-side, it is incredibly fast and avoids network bottlenecks.'
          }
        ]
      }
    ]
  },
  'pdf-studio': {
    title: 'Free PDF Studio - Merge, Split, Edit PDFs | Tool Cabinet',
    description: 'Merge, split, reorder, and encrypt PDF documents locally in your browser. 100% offline, no file size limits, and zero server tracking. Secure & private.',
    faq: [
      {
        category: 'Capabilities',
        items: [
          {
            question: 'How to merge and split PDFs securely without uploads?',
            answer: 'PDF Studio uses client-side Web APIs to read and manipulate PDF document structures. When you drag and drop PDF files into the tool, the browser parses the individual pages in memory, allowing you to drag pages to reorder, select pages to extract, or combine documents. This process is 100% local, so your confidential documents never touch any server.'
          },
          {
            question: 'What functions does Tool Cabinet PDF Studio support?',
            answer: 'PDF Studio supports merging multiple PDFs into one, splitting a PDF into individual pages, deleting pages, rotating pages, reordering pages via visual drag-and-drop, and encrypting/decrypting PDF documents with standard security algorithms.'
          }
        ]
      },
      {
        category: 'Encryption',
        items: [
          {
            question: 'Can I encrypt or password-protect my PDFs offline?',
            answer: 'Yes. Our PDF Studio provides on-device PDF encryption. You can set owner and user passwords and define permissions (e.g. disable printing or copying) directly in your browser. The cryptographic keys are generated locally, ensuring the highest level of document security.'
          }
        ]
      },
      {
        category: 'Confidentiality',
        items: [
          {
            question: 'Why are online PDF editors a security risk?',
            answer: 'Online PDF tools require you to upload tax documents, contracts, bank statements, or identity papers to their remote servers. This creates a major security risk for identity theft and data leaks. Tool Cabinet operates entirely offline, guaranteeing that your sensitive financial and personal records remain strictly private.'
          }
        ]
      }
    ]
  },
  'dictionary': {
    title: 'Free Dictionary & Reverse Dictionary | Tool Cabinet',
    description: 'Look up standard English word definitions, phonetics, and audio pronunciations, or search for words using concept descriptions. Fast and private.',
    faq: [
      {
        category: 'Search Modes',
        items: [
          {
            question: 'What is a reverse dictionary and how does it work?',
            answer: 'A reverse dictionary lets you find a word based on its description, concept, or meaning. If you have a phrase on the tip of your tongue (e.g. \"fear of heights\") or want to find words related to a theme, you can enter the description. We query the Datamuse semantic association index, returning the closest matching words along with their parts of speech and definitions.'
          },
          {
            question: 'Where do the definitions and audio pronunciations come from?',
            answer: 'Our standard dictionary pulls definitions, phonetic notations, and audio files from the Free Dictionary API. The reverse dictionary utilizes the Datamuse API. All selection and navigation occur instantly, providing standard meanings, synonyms, antonyms, and usage examples.'
          }
        ]
      },
      {
        category: 'Caching Engine',
        items: [
          {
            question: 'Does the dictionary tool cache my search queries?',
            answer: 'Yes. To deliver an ultra-fast and offline-ready experience, our dictionary tool uses aggressive client-side caching. Once you look up a word definition or search for a phrase, the result is saved in localStorage. The next time you search for that word, it loads instantly in milliseconds without hitting any external APIs.'
          }
        ]
      },
      {
        category: 'Student Privacy',
        items: [
          {
            question: 'Is my search history or dictionary activity private?',
            answer: 'Yes, your search queries and search history are stored only in your local browser storage. We do not track, log, or send your searches to any backend server. Your educational exploration and writing assistance remain 100% private.'
          }
        ]
      }
    ]
  },
  'what-is-my-ip': {
    title: 'What Is My IP - View Public IP & Location | Tool Cabinet',
    description: 'Instantly view your public IP address and query geo-location, ISP, and timezone data. 100% free, fast, and private.',
    faq: [
      {
        category: 'Identification',
        items: [
          {
            question: 'How does the IP Lookup tool find my public IP address?',
            answer: 'When you open our What Is My IP page, it makes a lightweight client-side fetch request to a public IP echo service. The service returns your public IPv4 or IPv6 address. Our tool then checks the address against a client-side geolocation index, displaying your approximate country, city, ISP, coordinate coordinates, and local timezone.'
          },
          {
            question: 'Why does my public IP address change?',
            answer: 'Most internet service providers (ISPs) assign dynamic IP addresses that change periodically. If you use a VPN, proxy, or connect to a different Wi-Fi network, your public IP address will update to reflect the exit node of that connection.'
          }
        ]
      },
      {
        category: 'Snoop Safety',
        items: [
          {
            question: 'Is my IP address saved or stored by Tool Cabinet?',
            answer: 'No. Tool Cabinet does not host a backend database or log user requests. The IP lookup runs purely in your active browser session. Your IP address is never stored, tracked, or sold to third-party ad networks, ensuring complete browsing privacy.'
          }
        ]
      },
      {
        category: 'Other Checks',
        items: [
          {
            question: 'Can I look up detail profiles for other IP addresses?',
            answer: 'Yes! Along with checking your own IP, we provide an IP Address Lookup tool where you can enter any public IPv4 or IPv6 address. It retrieves the ISP, geographic coordinates, country, region, and associated network metadata instantly.'
          }
        ]
      }
    ]
  }
};

export function getSeoData(toolId: string, toolName: string, toolDescription: string): SeoData {
  const override = OVERRIDE_SEO_DATA[toolId] || {};
  
  // 1. Generate optimized title (under 60 chars)
  const baseTitle = override.title || `Free ${toolName} | Offline & Private | Tool Cabinet`;
  const title = baseTitle.length > 60 ? baseTitle.substring(0, 57) + '...' : baseTitle;

  // 2. Generate optimized description (under 160 chars)
  const rawDesc = override.description || `${toolDescription} 100% client-side, offline, no file limits, and zero server uploads. Fast, free, and private.`;
  const description = rawDesc.length > 160 ? rawDesc.substring(0, 157) + '...' : rawDesc;

  // 3. Map tool categories to Schema.org software categories
  let category = 'UtilityApplication';
  if (toolId.includes('image') || toolId.includes('video') || toolId.includes('pdf') || toolId.includes('media') || toolId.includes('srt') || toolId.includes('vtt') || toolId.includes('downloader')) {
    category = 'MultimediaApplication';
  } else if (toolId.includes('json') || toolId.includes('xml') || toolId.includes('csv') || toolId.includes('tsv') || toolId.includes('binary') || toolId.includes('hex') || toolId.includes('base64') || toolId.includes('md5') || toolId.includes('password')) {
    category = 'DeveloperApplication';
  } else if (toolId.includes('converter') || toolId.includes('calculator')) {
    category = 'UtilitiesApplication';
  } else if (toolId.includes('color') || toolId.includes('design') || toolId.includes('rgb')) {
    category = 'DesignApplication';
  }

  // 4. Generate SoftwareApplication schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': `Tool Cabinet ${toolName}`,
    'applicationCategory': category,
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'description': toolDescription
  };

  // 5. Generate default FAQs if override is missing (guarantees 300+ words of category-split content)
  const faq: FaqCategory[] = override.faq || [
    {
      category: 'Usage Guidelines',
      items: [
        {
          question: `How to use the Tool Cabinet ${toolName}?`,
          answer: `To use our ${toolName}, simply enter your inputs or files in the interactive interface at the top of this page. The application will process your inputs instantly and generate the outputs, which you can copy or download. The entire operation executes locally on your hardware, eliminating any server delays.`
        },
        {
          question: `What inputs does the ${toolName} support?`,
          answer: `Our ${toolName} is engineered to support standard industry inputs and formats. Since the execution is fully browser-based, standard file structures and text formats are parsed instantly off-thread, ensuring zero load on your browser UI.`
        }
      ]
    },
    {
      category: 'Security & Privacy',
      items: [
        {
          question: `Is the ${toolName} safe and private to use?`,
          answer: `Yes, privacy and security are the core pillars of Tool Cabinet. Our ${toolName} runs 100% client-side in your browser. This means your text inputs, files, and generated data are never uploaded to any remote server, keeping them safe from network interceptors and corporate tracking.`
        },
        {
          question: `Does the ${toolName} require active internet?`,
          answer: `No. Once the page is loaded, the ${toolName} is fully functional without an internet connection. Because it does not rely on backend servers or APIs to do the processing, you can bookmark this page and perform tasks completely offline.`
        }
      ]
    },
    {
      category: 'Benefits & Limits',
      items: [
        {
          question: `What are the benefits of client-side ${toolName} processing?`,
          answer: `Client-side processing provides near-instantaneous results, since there is no upload or download latency. It also ensures unlimited usage with zero limits on file sizes or search queries, all while keeping your confidential information strictly private within your browser session.`
        }
      ]
    }
  ];

  return { title, description, schema, faq };
}
