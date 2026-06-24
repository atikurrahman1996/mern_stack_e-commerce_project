This README documents v1.x of the MCP Python SDK (the current stable release).

v2 is in alpha. Pre-releases are published to PyPI as 2.0.0aN and can be installed with an explicit pin, for example pip install mcp==2.0.0a1. See README.v2.md for the v2 documentation and the migration guide for what's changed. We're targeting a beta on 2026-06-30 and a stable v2 on 2026-07-27. If your package depends on mcp, add a <2 upper bound to your version constraint (for example mcp>=1.27,<2) before the stable release lands.

For v1.x code and documentation, see the v1.x branch. v1.x is in maintenance mode and continues to receive critical bug fixes and security patches.

Table of Contents
MCP Python SDK
Overview
Installation
Adding MCP to your python project
Running the standalone MCP development tools
Quickstart
What is MCP?
Core Concepts
Server
Resources
Tools
Structured Output
Prompts
Images
Context
Getting Context in Functions
Context Properties and Methods
Completions
Elicitation
Sampling
Logging and Notifications
Authentication
FastMCP Properties
Session Properties and Methods
Request Context Properties
Running Your Server
Development Mode
Claude Desktop Integration
Direct Execution
Streamable HTTP Transport
CORS Configuration for Browser-Based Clients
Mounting to an Existing ASGI Server
StreamableHTTP servers
Basic mounting
Host-based routing
Multiple servers with path configuration
Path configuration at initialization
SSE servers
Advanced Usage
Low-Level Server
Structured Output Support
Pagination (Advanced)
Writing MCP Clients
Client Display Utilities
OAuth Authentication for Clients
Parsing Tool Results
MCP Primitives
Server Capabilities
Documentation
Contributing
License
Overview
The Model Context Protocol allows applications to provide context for LLMs in a standardized way, separating the concerns of providing context from the actual LLM interaction. This Python SDK implements the full MCP specification, making it easy to:

Build MCP clients that can connect to any MCP server
Create MCP servers that expose resources, prompts and tools
Use standard transports like stdio, SSE, and Streamable HTTP
Handle all MCP protocol messages and lifecycle events
Installation
Adding MCP to your python project
We recommend using uv to manage your Python projects.

