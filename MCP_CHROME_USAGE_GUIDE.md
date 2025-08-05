# MCP Chrome Extension Usage Guide

## 🎯 What is MCP Chrome Extension?

The MCP (Model Context Protocol) Chrome Extension creates a bridge between AI assistants and your Chrome browser, enabling AI to interact with web pages directly. This allows for powerful browser automation, content extraction, and web interaction capabilities.

## 🔧 What You've Already Set Up

✅ **MCP Chrome Bridge installed** in Windows  
✅ **Chrome extension loaded and running**  
✅ **Server connected** on port 12306  
✅ **Sidebar interface working** (no more annoying popup!)  

## 🚀 Core Capabilities

### Browser Automation
- **Click buttons, links, and elements** on any webpage
- **Fill out forms** with provided data
- **Navigate between pages** and manage tabs
- **Scroll and interact** with page elements
- **Submit forms and trigger actions**

### Content Analysis
- **Extract text content** from any webpage
- **Capture screenshots** of full pages or specific elements
- **Search page content** semantically using AI embeddings
- **Parse structured data** from tables, lists, etc.
- **Monitor and analyze** network requests

### Data Management
- **Index webpage content** for semantic search
- **Cache and manage** extracted data
- **Export information** in various formats
- **Track browsing patterns** and page changes

## 💻 How to Use It

### Method 1: With Claude Code (Recommended)

1. **Add MCP Server to Claude Code Configuration**

   Copy this configuration block:
   ```json
   {
     "mcpServers": {
       "chrome-mcp-server": {
         "type": "streamable-http",
         "url": "http://127.0.0.1:12306/mcp"
       }
     }
   }
   ```

2. **Add to your Claude Code config file** (usually `~/.config/claude-code/mcp.json` or similar)

3. **Restart Claude Code** to load the MCP server

4. **Start giving browser commands** to Claude Code:
   ```
   "Take a screenshot of the current webpage"
   "Click the login button and fill out the form"
   "Extract all the product information from this page"
   ```

### Method 2: With Other MCP-Compatible Tools

- **Cline (VS Code Extension)**: Add the config to Cline's MCP settings
- **Continue.dev**: Configure in their MCP server settings  
- **Custom MCP Clients**: Use the HTTP endpoint `http://127.0.0.1:12306/mcp`

## 🎪 Practical Examples

### Web Scraping & Data Extraction
```
"Visit amazon.com and extract the top 10 product recommendations"
"Go to this news website and summarize the top 5 headlines"
"Extract all email addresses from this contact page"
"Get all the pricing information from this SaaS website"
```

### Form Automation
```
"Fill out this job application form with my resume data"
"Complete this survey using the responses I provide"
"Sign up for this newsletter with my email address"
"Update my profile information on this website"
```

### Testing & Quality Assurance
```
"Take screenshots of this page in different browser sizes"
"Test this contact form by submitting test data"
"Check if all links on this page are working"
"Verify that the checkout process works correctly"
```

### Research & Analysis
```
"Compare prices for this product across multiple websites"
"Research competitors' features and create a comparison table"
"Monitor this page for changes over time"
"Analyze the structure and content of this landing page"
```

### Social Media & Content
```
"Extract all the posts from this social media profile"
"Download images from this gallery page"
"Get statistics and metrics from this dashboard"
"Capture testimonials and reviews from this page"
```

## 🛠️ Managing the Extension

### Starting the Server
```bash
# In Windows Command Prompt
chrome-mcp-bridge
```

### Checking Connection Status
- Open the Chrome extension sidebar
- Look for "Service Running" status
- Port should show 12306
- Connection indicator should be green

### Troubleshooting
- **Server not running**: Start with `chrome-mcp-bridge` command
- **Connection failed**: Check port 12306 isn't blocked
- **Extension not working**: Reload extension in `chrome://extensions/`
- **Sidebar not opening**: Right-click extension icon → "Open side panel"

## 📁 Extension Features

### Native Server Configuration
- **Running Status**: Shows if the MCP server is active
- **Connection Port**: Default 12306 for HTTP connection
- **Connect Button**: Establishes connection to server

### Semantic Engine
- **AI-powered content search** across indexed pages
- **Initialize button**: Downloads and sets up AI models
- **Model selection**: Choose between lightweight and performance models

### Embedding Models
- **multilingual-e5-small**: 116MB, fast, good for most tasks
- **multilingual-e5-base**: 279MB, better performance, more accurate

### Index Data Management
- **Indexed Pages**: Count of pages processed for semantic search
- **Index Size**: Storage space used by indexed content
- **Active Tabs**: Currently monitored browser tabs
- **Vector Documents**: Processed content chunks for AI search

### Model Cache Management
- **Cache Size**: Space used by downloaded AI models
- **Cache Entries**: Number of cached model files
- **Clear Data**: Reset all cached data and settings

## 🔐 Security & Privacy

- **Local Processing**: All AI models run locally in your browser
- **No Data Sent**: Content analysis happens on your machine
- **Selective Access**: Only processes pages you explicitly request
- **Secure Connection**: Uses local HTTP connection (127.0.0.1)

## 🎯 Next Steps

1. **Connect to Claude Code** using the configuration above
2. **Test basic functionality** with simple commands like screenshots
3. **Explore automation** for repetitive web tasks
4. **Build workflows** combining multiple browser actions
5. **Create custom integrations** with your development projects

## 📚 Advanced Usage

### Custom Workflows
Chain multiple browser actions together:
```
"Navigate to LinkedIn, search for AI engineers in Seattle, 
extract the first 20 profiles, and save their information to a spreadsheet"
```

### Integration with Development
```
"Monitor this web app's network requests during testing"
"Take screenshots of all pages in my website for documentation"
"Test form validation by submitting various invalid inputs"
```

### Content Creation
```
"Research this topic across multiple websites and create a summary"
"Collect testimonials from customer review pages"
"Extract code examples from documentation sites"
```

## 🆘 Getting Help

- **Extension Issues**: Check Chrome Developer Tools console
- **Server Problems**: Look at command prompt where server is running
- **Connection Errors**: Verify Windows firewall isn't blocking port 12306
- **AI Model Issues**: Try clearing cache and re-downloading models

---

**Your MCP Chrome Extension is ready to use! Start with simple commands and gradually build up to more complex browser automation workflows.**