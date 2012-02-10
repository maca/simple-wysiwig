(($) ->
  throw 'mkEditor depends on markdown.js (https://github.com/evilstreak/markdown-js)' unless window.markdown

  query_command_state = (command) ->
    document.queryCommandState command

  exec_command = (command) ->
    document.execCommand command, false, null

  format_state = () ->
    document.queryCommandValue("FormatBlock").toLowerCase()

  change_format = (format) ->
    # format = 'p' if format_state() is format
    document.execCommand "FormatBlock", null, "<#{format}>"

  insert = (text) ->
    document.execCommand 'insertHtml', false, text
  
  set_caret = (element) ->
    element = $(element)[0]
    if document.createRange                     # Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange()            # Create a range (a range is a like the selection but invisible)
      range.selectNodeContents element          # Select the entire contents of the element with the range
      range.collapse false                      # collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection()         # get the selection object (allows you to change selection)
      selection.removeAllRanges()               # remove any selections already made
      selection.addRange range                  # make the range you have just created the visible selection
    else if document.selection                  # IE 8 and lower
      range = document.body.createTextRange()   # Create a range (a range is a like the selection but invisible)
      range.moveToElementText element           # Select the entire contents of the element with the range
      range.collapse false                      # collapse the range to the end point. false means collapse to end rather than the start
      range.select();                           # Select the range (make it the visible selection)

  current_node = ->
    if window.getSelection
      $ window.getSelection().anchorNode.parentNode
    else if document.selection
      range = document.selection.createRange()
      range.collapse true
      range.parentElement()

  current_tag = ->
    current_node()[0].tagName.toLowerCase()

  button_defaults =
    bold : 
      text   : '<b>B</b>'
      hint   : 'Bold'
      action : ->
        console.log 'this'
        exec_command 'bold'
    italic :
      text   : '<i>I</i>'
      hint   : 'Italicize'
      action : ->
        exec_command 'italic'
    ul :
      text   : '• –'
      hint   : 'Unordered List'
      action : ->
        exec_command 'insertUnorderedList'
    ol :
      text   : '1. –'
      hint   : 'Ordered List'
      action : ->
        exec_command 'insertOrderedList'
    link :
      text   : '\uD83D\uDD17' 
      hint   : 'Link to a web page'
      action : ->
        url = prompt "URL:", "http://"
        document.execCommand "createLink", false, url
    image :
      text   : '\uD83C\uDFB4' 
      hint   : 'Insert image'
      action : ->
        url = prompt "URL:", "http://"
        document.execCommand "InsertImage", false, url
    hr :
      text   : '―' 
      hint   : 'Insert image'
      action : ->
        document.execCommand "insertHorizontalRule", false, null
    blockquote :
      text   : '“' 
      hint   : 'Insert quotation'
      action : ->
        change_format 'BLOCKQUOTE'
        # document.execCommand("indent", false, null)
        # insert '<blockquote data-inserted="true"><p></br></p></blockquote>'
        # quote = $('blockquote[data-inserted]').removeAttr('data-inserted')
        # set_caret quote
    code :
      text   : '{}' 
      hint   : 'Format as code'
      action : ->
        change_format 'pre'
    paragraph :
      text   : '¶' 
      hint   : 'Format as paragraph'
      action : ->
        document.execCommand("outdent", false, null)
        change_format 'p'
    h1 :
      text   : 'h1' 
      hint   : 'Heading 1'
      action : ->
        change_format 'h1'
    h2 :
      text   : 'h2' 
      hint   : 'Heading 2'
      action : ->
        change_format 'h2'
    h3 :
      text   : 'h3' 
      hint   : 'Heading 3'
      action : ->
        change_format 'h3'
    h4 :
      text   : 'h4' 
      hint   : 'Heading 4'
      action : ->
        change_format 'h4'
    h5 :
      text   : 'h5' 
      hint   : 'Heading 5'
      action : ->
        change_format 'h5'
    h6 :
      text   : 'h6' 
      hint   : 'Heading 6'
      action : ->
        change_format 'h6'

  parse = window.markdown.toMarkdown = (html) ->
    output = ''
    $(html).contents().each ->
      node     = $(this)
      tag_name = this.tagName

      if node.parents(tag_name).not('p, blockquote').size() > 0 
        text = node.text()
        return output = output + text.replace(/([\\`*_#+\-!{}()\[\]])/g, '\\$1')

      if this.nodeType is 3
        output = output + node.text()

      else if node.filter('b, strong').size() > 0
        output = output + "**#{parse node}**" if node.text()

      else if node.filter('i, em').size() > 0
        output = output + "*#{parse node}*" if node.text()

      else if node.filter('a').size() > 0
        text  = node.text()
        href  = node.attr('href')
        title = node.attr('title')
        link  =
          if href == text
            "<#{href}>"
          else if title
            "[#{text}](#{href} \"#{title}\")"
          else
            "[#{text}](#{href})"
        output = output + link

      else if node.filter('br').size() > 0
        output = "#{output} \n"

      else if node.filter('hr').size() > 0
        output = "- - -\n"

      else if node.filter('p').size() > 0
        output = output + "#{parse node}\n\n"

      else if node.filter('blockquote').size() > 0
        nesting = parseInt node.parents('blockquote').size()
        starter = ('>' for num in [1..nesting + 1]).join('')

        quoted  = parse node
        quoted  = quoted.replace(/^(\n|[^>].*)/gm, "#{starter} $1")
        if nesting > 0
          quoted = "\n#{quoted}" unless quoted.match(/\n/)
        else
          quoted = "#{quoted}\n" unless quoted.match(/\n$/)

        output = output + quoted

      else if node.filter('h1, h2, h3, h4, h5, h6').size() > 0
        count  = parseInt this.tagName.match(/\d/)
        output = output + "#{('#' for num in [1..count]).join('')} #{node.text()}\n\n"

      else if node.filter('ol, ul').size() > 0
        count  = 0
        items  = ""
        node.children('li').each ->
          if node.filter('ol').size() > 0
            item = "#{count += 1}.  #{parse this}"
          else
            item = "-   #{parse this}"

          lines = for line in item.split('\n')
            if line.match(/(^$|^(\n|-|\d+\.))/) then line else "    #{line}"
          item = lines.join('\n')

          item  = "#{item}\n" unless item.match(/\n$/)
          items = items + item
        items  = "#{items}\n" unless items.match(/\n\n$/)
        output = output + items

      else if node.filter('code').size() > 0
        code   = node.text().replace(/^(.*)/gm, "    $1")
        code   = "#{code}\n" unless code.match(/\n$/)
        output = output + code
      
      else
        output = output + parse node
    output
  
  create_toolbar = (buttons, button_attrs) ->
    toolbar  = $ '<div class="toolbar">'
    editable_area = this

    console.log this

    for own name, attrs of button_defaults
      do (name, attrs) ->
        if $.inArray(name, buttons) >= 0
          attrs = $.extend {}, attrs, button_attrs[name]
          button = $('<button>').addClass(name).attr('title', attrs.hint).html(attrs.text).click ->
            attrs.action.apply this
            editable_area.focus()
            return false
        toolbar.append button
    toolbar

  create_editable_area = ->
    editable = $ '<div class="editable" contenteditable="true">'

  $.fn.mkEditor = (opts = {}) ->
    defaults = 
      buttons : ['bold', 'italic', 'ul', 'ol', 'link', 'image', 'hr', 'blockquote', 'code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      button_attrs : {}

    opts = $.extend defaults, opts

    return this.each ->
      input         = $(this)
      editor        = $ '<div class="mkEditor">'
      editable_area = create_editable_area()
      toolbar       = create_toolbar.apply editable_area, [opts.buttons, opts.button_attrs]
      input.after editor.append(toolbar, editable_area) 
      editable_area.html window.markdown.toHTML(input.val())

      editable_area.bind 'parse', ->
        input.val parse $(this)

      editable_area.keydown (e) ->
        console.log current_tag()

        if current_tag() is 'div'
          change_format 'p'
        if e.keyCode is 9
          insert '\u00a0\u00a0'
          return false
        # if e.keyCode is 13 and current_tag() is 'pre'
        #   insert '<br/>'
        #   return false

      editable_area.bind 'paste', (e) ->
        clipboard = e.originalEvent.clipboardData.getData 'text'
        insert window.markdown.toHTML clipboard
        false
)(jQuery)
